import "../../styles/MatchDropdownList.css";
import { useMatchDropdownData } from "../../hooks/useMatchDropdownData";

function MatchDropdownList() {
  const { rule, setRule, matches, match, setMatch } = useMatchDropdownData();

  return (
    <div className="info-area-match">
      <p className="info-title">시즌 정보</p>
      <div className="info-box">
        <div className="radio-group">
          <label>
            <input type="radio" name="rule" value="single"
            checked={rule === "single"} onChange={() => setRule("single")}
            />
            싱글
          </label>
          <label>
            <input
              type="radio" name="rule" value="double"
              checked={rule === "double"} onChange={() => setRule("double")}
            />
            더블
          </label>
        </div>
        {/* 시즌 드롭다운 */}
        <select className="season-list text-body"
          value={match?.cid || ""}
          onChange={(e) => {
            const next = matches.find((m) => m.cid === e.target.value);
            setMatch(next || null);
          }}
        >
          {matches.map((m) => (
            <option className="center-input" key={m.cid} value={m.cid}>{m.name} ({m.start} - {m.end})</option>
          ))}

        </select>
        {match && (
          <span>
            총 {match.cnt}명, 마스터볼 이상 {match.rank_cnt}명
          </span>
        )}
      </div>

    </div>
  );
}

export default MatchDropdownList;
