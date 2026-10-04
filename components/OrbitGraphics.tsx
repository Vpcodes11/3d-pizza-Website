export default function OrbitGraphics({ front = false }: { front?: boolean }) {
  return <div className={`orbit-frame${front ? " orbit-frame--front" : ""}`} aria-hidden="true"><div className="orbit-depth" data-parallax data-depth={front ? 12 : -6}><svg className="orbit-graphics" viewBox="0 0 1000 1000" fill="none">
    <g data-orbit-rotation data-orbit-direction={front ? -.35 : 1}>
      {!front && <><circle data-orbit cx="500" cy="500" r="466" pathLength="1" strokeDasharray=".53 .47" transform="rotate(-124 500 500)" />
      <circle data-orbit cx="500" cy="500" r="492" pathLength="1" strokeDasharray=".18 .82" transform="rotate(131 500 500)" /></>}
      {front && <circle data-orbit cx="500" cy="500" r="413" pathLength="1" strokeDasharray=".32 .68" transform="rotate(23 500 500)" />}
    </g>
    {!front && <><circle className="orbit-dot" cx="241" cy="112" r="4" />
    <circle className="orbit-dot" cx="878" cy="772" r="3" /></>}
  </svg></div></div>;
}
