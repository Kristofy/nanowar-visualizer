import { Planet } from './planet';
import { Player } from './player';
import { Troop } from './troop';
import { JsonPlanet, JsonPlanetInit, JsonPlayer, JsonTick, JsonTroops } from './interfaces';
import * as p5 from 'p5';

export class GameModule {
  planets: Planet[];
  players: Player[];
  troops: Troop[];

  constructor(planet_data: JsonPlanetInit[], player_data: JsonPlayer[]) {
    this.players = player_data.map((x) => new Player(x));
    this.planets = planet_data.map((x) => this.createPlanet(x));
    this.troops = [];
  }

  render(ctx: p5, frame_percent: number): void {
    this.planets.forEach((p) => p.render(ctx));
    this.troops?.forEach((t) => t.render(ctx, frame_percent));
  }

  update(data: JsonTick) {
    const { planets, troops }: { planets: JsonPlanet[]; troops: JsonTroops[] } = data;
    this.troops = troops.map((x) => this.createTroops(x));
    this.planets.forEach((p, i) =>
      p.update(planets[i].population, this.players[planets[i].player] || null),
    );
  }

  createPlanet({
    id,
    x,
    y,
    size,
    population,
    player,
  }: {
    id: number;
    x: number;
    y: number;
    size: number;
    population: number;
    player: number;
  }): Planet {
    return new Planet(id, x, y, size, population, this.players[player] || null);
  }

  createTroops({
    id,
    from,
    to,
    player,
    size,
    distance,
    progress,
  }: {
    id: number;
    from: number;
    to: number;
    player: number;
    size: number;
    distance: number;
    progress: number;
  }): Troop {
    return new Troop(
      id,
      this.planets[from],
      this.planets[to],
      this.players[player],
      size,
      distance,
      progress,
    );
  }
}
