import { Edge } from "../shared/Edge";
import { POINTS } from "./constants";

export function Connections() {
  return (
    <>
      {POINTS.slice(0, -1).map((p, i) => (
        <Edge key={i} from={p} to={POINTS[i + 1]} />
      ))}
    </>
  );
}
