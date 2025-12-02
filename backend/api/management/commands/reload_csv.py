import os
import re
import pandas as pd
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import models, transaction

class Command(BaseCommand):
    help = "FK 의존성 순서에 맞게 모든 CSV를 자동 Import합니다 (위상 정렬 기반, bulk_create)."

    @staticmethod
    def _to_cli_name(model_name: str) -> str:
        """Convert CamelCase model name to snake_case CLI flag name."""
        return re.sub(r"(?<!^)(?=[A-Z])", "_", model_name).lower()

    def add_arguments(self, parser):
        # --all : 전체 CSV import (기본값과 동일 동작)
        parser.add_argument(
            "--all",
            action="store_true",
            help="모든 CSV 파일을 import (기본 동작)",
        )

        # --<model> : 특정 모델만 CSV import
        app = apps.get_app_config("api")
        for model in app.get_models():
            cli_name = self._to_cli_name(model.__name__)

            # Django 기본 옵션 --version 과 충돌을 피하기 위해 version 모델만 접두사 부여
            if cli_name == "version":
                option_strings = ["--model-version"]
            else:
                # 사용자가 --match 또는 --model-match 둘 다 사용할 수 있도록 alias 제공
                option_strings = [f"--{cli_name}", f"--model-{cli_name}"]

            parser.add_argument(
                *option_strings,
                dest=f"model_{cli_name}",
                action="store_true",
                help=f"{model.__name__} 모델의 CSV만 import",
            )

    def handle(self, *args, **options):
        base_path = os.path.join(os.getcwd(), "tables")

        if not os.path.exists(base_path):
            self.stdout.write(self.style.ERROR(f"❌ CSV 폴더를 찾을 수 없습니다: {base_path}"))
            return

        app = apps.get_app_config("api")
        models_in_app = list(app.get_models())

        # -------------------------------------------------------
        # 1️⃣ FK 의존 관계 분석
        def get_fk_dependencies(model):
            deps = set()
            for f in model._meta.fields:
                if isinstance(f, models.ForeignKey):
                    deps.add(f.related_model.__name__)
            return deps

        # -------------------------------------------------------
        # 2️⃣ 위상 정렬 (topological sort)
        def topological_sort(models):
            graph = {m.__name__: get_fk_dependencies(m) for m in models}
            sorted_models = []
            visited = set()

            def visit(node):
                if node in visited:
                    return
                visited.add(node)
                for dep in graph.get(node, []):
                    if dep in graph:
                        visit(dep)
                sorted_models.append(node)

            for m in models:
                visit(m.__name__)

            name_to_model = {m.__name__: m for m in models}
            return [name_to_model[name] for name in sorted_models if name in name_to_model]

        ordered_models = topological_sort(models_in_app)

        # -------------------------------------------------------
        # 선택된 모델 필터링
        # --all 이거나 아무 옵션도 없으면 전체 수행
        selected_flags = {
            self._to_cli_name(m.__name__)
            for m in models_in_app
            if options.get(f"model_{self._to_cli_name(m.__name__)}")
        }

        if options.get("all") or not selected_flags:
            target_models = ordered_models
        else:
            target_models = [m for m in ordered_models if self._to_cli_name(m.__name__) in selected_flags]

        if not target_models:
            self.stdout.write(self.style.WARNING("⚠️ 선택된 모델이 없습니다. 옵션을 확인해주세요."))
            return

        # -------------------------------------------------------
        # 3️⃣ bulk_create insert 실행
        CHUNK = 10000  # 성능 최적화를 위한 chunk

        for model in target_models:
            model_name = model.__name__
            snake_name = re.sub(r'(?<!^)(?=[A-Z])', '_', model_name).lower()
            csv_path = os.path.join(base_path, f"{snake_name}.csv")

            if not os.path.exists(csv_path):
                self.stdout.write(self.style.WARNING(f"⚠️ {csv_path} 없음 — 건너뜀"))
                continue

            # 기존 데이터를 모두 비우고 새로 적재 (FK 순서를 맞춘 topological order 기반)
            self.stdout.write(f"🧹 {model_name} 테이블 기존 행 삭제 중...")
            model.objects.all().delete()

            self.stdout.write(f"📂 {csv_path} → {model_name} 테이블로 불러오는 중...")

            try:
                df = pd.read_csv(csv_path)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ CSV 읽기 실패: {csv_path} — {e}"))
                continue

            fields = [f for f in model._meta.fields]

            # 모델에 존재하는 컬럼만 필터링
            expected_cols = set()
            for f in fields:
                if isinstance(f, models.ForeignKey):
                    expected_cols.add(f.db_column or f"{f.name}_id")
                    expected_cols.add(f"{f.name}_id")
                else:
                    expected_cols.add(f.db_column or f.name)

            df = df[[c for c in df.columns if c in expected_cols]]

            objs = []
            for _, row in df.iterrows():
                data = {}

                for f in fields:
                    if isinstance(f, models.ForeignKey):
                        col = f.db_column or f"{f.name}_id"
                        if col not in df.columns:
                            alt = f"{f.name}_id"
                            if alt not in df.columns:
                                continue
                            col = alt
                        value = row[col]
                        if pd.isna(value):
                            continue
                        data[f"{f.name}_id"] = int(value)
                    else:
                        col = f.db_column or f.name
                        if col not in df.columns:
                            continue
                        value = row[col]
                        if pd.isna(value):
                            continue
                        data[f.name] = value

                objs.append(model(**data))

            inserted = 0

            # ---------------------------
            # bulk_create chunk 처리
            # ---------------------------
            with transaction.atomic():
                for i in range(0, len(objs), CHUNK):
                    batch = objs[i:i+CHUNK]
                    try:
                        model.objects.bulk_create(batch, ignore_conflicts=True)
                        inserted += len(batch)
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"❌ {model_name} bulk_create 실패: {e}"))
                        raise

            self.stdout.write(self.style.SUCCESS(f"✅ {inserted}행 {model_name} 추가 완료"))

        self.stdout.write(self.style.SUCCESS("🎉 모든 CSV Import (bulk_create) 완료"))
