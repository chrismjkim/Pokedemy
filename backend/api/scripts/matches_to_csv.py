from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple
import pandas as pd
import pokemonhome as phome
import json

# Convenience aliases for readability
Season = Dict[str, Any]
Match = Dict[str, Any]


def load_seasons() -> Dict[str, Season]:
    """Fetch all seasons and ensure they are returned as a dictionary."""
    raw_seasons: Any = phome.fetch_seasons()
    return json.loads(raw_seasons) if isinstance(raw_seasons, str) else raw_seasons


def iter_matches(seasons: Dict[str, Season]) -> Iterable[Tuple[str, Match]]:
    """Yield (season_id, match) pairs from the seasons mapping."""
    for season_id, season in seasons.items():
        match_iterable = season.values() if isinstance(season, dict) else season
        for match in match_iterable:
            yield season_id, match


def build_dataframe(seasons: Dict[str, Season]) -> pd.DataFrame:
    rows: List[Dict[str, Any]] = []

    for season_id, match in iter_matches(seasons):
        typed_match: Match = match

        row = dict(typed_match)
        row.setdefault("season_id", season_id)
        rows.append(row)

    return pd.DataFrame(rows)


def save_csv(df: pd.DataFrame, filename: str = "match.csv") -> Path:
    base_dir = Path(__file__).resolve().parent.parent.parent  # .../backend
    tables_dir = base_dir / "tables"
    tables_dir.mkdir(parents=True, exist_ok=True)

    output_path = tables_dir / filename
    df.to_csv(output_path, index=False)
    return output_path


def main():
    seasons = load_seasons()
    df = build_dataframe(seasons)
    output_path = save_csv(df)
    print(f"✅ Saved matches to {output_path}")


if __name__ == "__main__":
    main()
