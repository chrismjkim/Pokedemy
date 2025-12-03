"""
item.csv의 sprite_id 값을 item_{id:04d}.png 형태로 일괄 변환합니다.
"""

import pandas as pd
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]  # 프로젝트 루트
CSV_PATH = ROOT / "backend" / "tables" / "item.csv"


def format_sprite(val):
    if pd.isna(val):
        return val
    try:
        sid = int(float(val))
    except (ValueError, TypeError):
        return val
    return f"item_{sid:04d}.png"


def main():
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
    if "sprite_id" not in df.columns:
        raise KeyError("sprite_id column not found in item.csv")
    df["sprite_id"] = df["sprite_id"].apply(format_sprite)
    df.to_csv(CSV_PATH, index=False, encoding="utf-8-sig")
    print(f"✅ sprite_id 변환 완료: {len(df)} 행 저장 ({CSV_PATH})")


if __name__ == "__main__":
    main()
