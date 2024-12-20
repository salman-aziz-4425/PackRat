import { queryTrpc } from '../../trpc';
import { useAuthUser } from 'app/modules/auth';

interface TripData {
  owner_id: string;
  // other properties as needed
}
export const useFetchSingleTrip = (tripId: string) => {
  const user = useAuthUser();
  const { refetch, data, error, isLoading, isError } =
    queryTrpc.getTripById.useQuery<TripData>(
      { tripId },
      {
        enabled: true,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
      },
    );
  const isOwner = data && user && data.owner_id === user.id;
  return { refetch, data, error, isLoading, isOwner, isError };
};

// export const useCreatePack = () => {
//     const mutation = queryTrpc.addPack.useMutation();
// }
