"""
폼 스프라이트 파일명을 새 규칙으로 일괄 변환하는 도구.

구 규칙
 - form=0: {pokemon_species_id}.png
 - form>0: {pokemon_species_id}-{form_id:02d}.png

신 규칙
 - {pokemon_species_id}_{form}_{pokemon_species.name}.png

사용 방법 (backend 디렉터리에서):
    python manage.py shell -c "from api.scripts.rename_form_images import main; main(apply=False)"
    python manage.py shell -c "from api.scripts.rename_form_images import main; main(apply=True)"

`apply=False`는 드라이런; `apply=True`일 때 실제 rename 수행.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import sys
import csv


BASE_DIR = Path(__file__).resolve().parent.parent  # backend/api
PROJECT_ROOT = BASE_DIR.parent                    # backend/
IMAGES_DIR = PROJECT_ROOT / "static" / "pokemon_form_images"
SPECIES_CSV = PROJECT_ROOT / "tables" / "pokemon_species.csv"


def load_species_map() -> dict[int, str]:
    """pokemon_species.csv에서 id -> name 매핑 로드."""
    if not SPECIES_CSV.exists():
        raise FileNotFoundError(f"species csv not found: {SPECIES_CSV}")

    species = {}
    with SPECIES_CSV.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                sid = int(row["id"])
            except (KeyError, ValueError):
                continue
            name = row.get("name") or ""
            # 파일명 안전을 위해 공백 제거, 소문자 유지
            safe_name = name.replace(" ", "_")
            species[sid] = safe_name
    return species


def parse_old_filename(path: Path) -> tuple[int, int] | None:
    """
    기존 파일명에서 (species_id, form) 튜플을 추출.
    지원 형태:
      - 003.png      -> (3, 0)
      - 003-02.png   -> (3, 2)
    """
    stem = path.stem
    try:
        if "-" in stem:
            species_str, form_str = stem.split("-", 1)
            return int(species_str), int(form_str)
        return int(stem), 0
    except ValueError:
        return None


def build_new_name(species_id: int, form: int, species_name: str) -> str:
    return f"{species_id:04d}_{form:02d}_{species_name}.png"


def rename_files(apply: bool = False, overwrite: bool = False) -> None:
    species_map = load_species_map()
    if not IMAGES_DIR.exists():
        raise FileNotFoundError(f"images directory not found: {IMAGES_DIR}")

    renames = []
    skipped_no_species = []
    skipped_conflict = []

    for path in sorted(IMAGES_DIR.glob("*.png")):
        parsed = parse_old_filename(path)
        if parsed is None:
            skipped_no_species.append((path, "unparsable filename"))
            continue

        species_id, form = parsed
        species_name = species_map.get(species_id)
        if not species_name:
            skipped_no_species.append((path, f"species_id {species_id} not found in CSV"))
            continue

        new_name = build_new_name(species_id, form, species_name)
        new_path = path.with_name(new_name)

        if new_path.exists() and new_path != path and not overwrite:
            skipped_conflict.append((path, new_path))
            continue

        if new_path != path:
            renames.append((path, new_path))

    # 보고
    print(f"총 {len(list(IMAGES_DIR.glob('*.png')))}개 파일 중 rename 대상 {len(renames)}개")
    if skipped_no_species:
        print(f"⚠️  CSV에 species가 없거나 파싱 실패하여 건너뜀: {len(skipped_no_species)}")
        for old, reason in skipped_no_species[:5]:
            print(f"  - {old.name}: {reason}")
        if len(skipped_no_species) > 5:
            print("  ...")
    if skipped_conflict:
        print(f"⚠️  대상 이름이 이미 존재하여 건너뜀(덮어쓰기 미사용): {len(skipped_conflict)}")
        for old, new in skipped_conflict[:5]:
            print(f"  - {old.name} -> {new.name}")
        if len(skipped_conflict) > 5:
            print("  ...")

    # 실행
    if not apply:
        print("\n드라이런 모드입니다. --apply로 실행하세요.")
        return

    for old, new in renames:
        new.unlink(missing_ok=True) if overwrite else None
        old.rename(new)
    print(f"✅ 실제 rename 완료: {len(renames)}개")


def main(argv: list[str] | None = None, apply: bool | None = None):
    """
    CLI와 manage.py shell 양쪽에서 쓰기 위한 엔트리포인트.
    - CLI: python -m api.scripts.rename_form_images --apply
    - shell: main(apply=True)
    """
    if apply is not None:
        rename_files(apply=apply)
        return

    parser = argparse.ArgumentParser(description="Rename pokemon form images to new naming rule.")
    parser.add_argument("--apply", action="store_true", help="실제 파일명을 변경합니다 (기본은 드라이런).")
    parser.add_argument("--overwrite", action="store_true", help="충돌 시 기존 새 파일명을 덮어씁니다.")
    args = parser.parse_args(argv)
    rename_files(apply=args.apply, overwrite=args.overwrite)


if __name__ == "__main__":
    main()
