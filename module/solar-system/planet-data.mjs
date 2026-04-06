/**
 * Visual and orbital data for all solar system bodies.
 * size     – tile diameter in pixels
 * color    – hex fill color for placeholder SVG
 * orbit    – hex color for orbit ring
 * axis     – semi-major axis in AU (used only for orbit ring radius; real
 *             positions come from the astronomy engine)
 */
export const PLANETS = [
  {
    id: "sun",
    name: "Sun",
    body: null,           // no HelioVector for the sun – it's always at centre
    color: "#FFD700",
    orbit: null,
    size: 60,
    axis: 0
  },
  {
    id: "mercury",
    name: "Mercury",
    body: "Mercury",
    color: "#A8A8A8",
    orbit: "#999999",
    size: 14,
    axis: 0.387
  },
  {
    id: "venus",
    name: "Venus",
    body: "Venus",
    color: "#E8C46A",
    orbit: "#C8A84A",
    size: 18,
    axis: 0.723
  },
  {
    id: "earth",
    name: "Earth",
    body: "Earth",
    color: "#4A90D9",
    orbit: "#3A70B9",
    size: 20,
    axis: 1.0
  },
  {
    id: "mars",
    name: "Mars",
    body: "Mars",
    color: "#C1440E",
    orbit: "#A1340E",
    size: 16,
    axis: 1.524
  },
  {
    id: "jupiter",
    name: "Jupiter",
    body: "Jupiter",
    color: "#C88B3A",
    orbit: "#A87030",
    size: 36,
    axis: 5.203
  },
  {
    id: "saturn",
    name: "Saturn",
    body: "Saturn",
    color: "#E4D191",
    orbit: "#C4B171",
    size: 30,
    axis: 9.537
  },
  {
    id: "uranus",
    name: "Uranus",
    body: "Uranus",
    color: "#7DE8E8",
    orbit: "#5DC8C8",
    size: 24,
    axis: 19.19
  },
  {
    id: "neptune",
    name: "Neptune",
    body: "Neptune",
    color: "#5B5DEA",
    orbit: "#3B3DCA",
    size: 22,
    axis: 30.07
  },
  {
    id: "pluto",
    name: "Pluto",
    body: "Pluto",
    color: "#A08060",
    orbit: "#806040",
    size: 10,
    axis: 39.48
  }
];

/** Scene dimensions and projection constants */
export const SCENE = {
  width: 9000,
  height: 9000,
  /** Pixels per Astronomical Unit */
  scale: 110,
  /** Sun is at the centre of the scene */
  get sunX() { return this.width / 2; },
  get sunY() { return this.height / 2; }
};
