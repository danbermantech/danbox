type PlayerAction = {
  label: string;
  action: string;
  value: string;
  styles?: React.CSSProperties;
};

type PlayerProps = {
  name: string;
  id: string;
  points: number;
  gold: number;
  teamId: string;
  items: {name:string, description:string, image:string}[];
  history: PlayerProps[];
  spaceId: string,
  previousSpaceId: string,
  image: string;
  controls: PlayerAction[];
  hasMoved: boolean;
};

export default class Player {

  name: string;
  id: string;
  points: number;
  gold: number;
  teamId: string;
  items: {name:string, description:string, image:string}[];
  history: (PlayerProps)[];
  spaceId: string;
  previousSpaceId: string;
  image: string;
  controls: PlayerAction[];
  hasMoved: boolean;

  constructor(props:PlayerProps) {
    this.name = props.name;
    this.id = props.id;
    this.points = props.points;
    this.gold = props.gold;
    this.teamId = props.teamId;
    this.items = props.items;
    this.history = props.history;
    this.spaceId = props.spaceId;
    this.previousSpaceId = props.previousSpaceId;
    this.image = props.image;
    this.controls = props.controls;
    this.hasMoved = props.hasMoved;
    this.history = []
  }

  move(spaceId:string) {
    this.previousSpaceId = this.spaceId;
    this.spaceId = spaceId;
    this.hasMoved = true;
    this.history.push({...this, round: this.history.length})
  }

}