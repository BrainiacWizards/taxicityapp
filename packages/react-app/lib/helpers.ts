import { iRank, iRoute, iTaxi } from '@/models/RankMapModels';

export const constructRouteString = (route: iRoute, ranks: iRank[]) => {
  const fromTown = ranks.find((rank) => rank.rankId === route.fromRankId)?.town;
  const fromCity = ranks.find((rank) => rank.rankId === route.fromRankId)?.city;

  const toTown = ranks.find(
    (rank) => rank.rankId === route.destinationRankId
  )?.town;
  const toCity = ranks.find(
    (rank) => rank.rankId === route.destinationRankId
  )?.city;

  return `${fromTown} - ${toTown}`;
};

export const findRoute = (taxi: iTaxi, routes: iRoute[]) => {
  return routes.find((route) => route.routeId === taxi.routeId) as iRoute;
};

export const findRank = (taxi: iTaxi, ranks: iRank[]) => {
  return ranks.find((rank) => rank.rankId === taxi.rankId) as iRank;
};
