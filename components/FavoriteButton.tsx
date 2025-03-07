import axios from "axios";
import React, {useCallback, useMemo} from "react";

import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { toast } from "react-hot-toast";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
    movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({movieId}) =>{
    const{ mutate: mutateFavorites} = useFavorites();
    const {data: currentUser, mutate} = useCurrentUser();

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || [];
        return list.includes(movieId);
    }, [currentUser, movieId]);

    const toggleFavorites = useCallback(async () => {

        try {
            let response;

            // Optimistically update the UI
            const updatedFavoriteIds = isFavorite
                ? currentUser?.favoriteIds.filter((id: string) => id !== movieId)
                : [...(currentUser?.favoriteIds || []), movieId];

            mutate({
                ...currentUser,
                favoriteIds: updatedFavoriteIds,
            }, false); // `false` prevents revalidation of the SWR cache

            if (isFavorite) {
                response = await axios.delete('/api/favorite', { data: { movieId } });
            } else {
                response = await axios.post('/api/favorite', { movieId });
            }

            // Update the local state with the response from the API
            const finalFavoriteIds = response?.data?.favoriteIds;
            mutate({
                ...currentUser,
                favoriteIds: finalFavoriteIds,
            }, true); // `true` revalidates the SWR cache

            // Revalidate the favorites list
            mutateFavorites();

            // Show a success message
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        } catch (error) {
            console.error('Error toggling favorite:', error);

            // Revert the optimistic update
            mutate({
                ...currentUser,
                favoriteIds: currentUser?.favoriteIds || [],
            }, true);

            // Show an error message
            toast.error('Something went wrong');
        }
        
        // let response;
        
        // if(isFavorite){
        //     response = await axios.delete('/api/favorite', {data: {movieId} });
        // }
        // else {
        //     response = await axios.post('/api/favorite', {movieId});
        // }

        // const updatedFavoriteIds = response?.data?.favoriteIds;

        // mutate({
        //     ...currentUser,
        //     favoriteIds: updatedFavoriteIds
        // });

        // mutateFavorites();


    }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

    return(
        <div
        onClick={toggleFavorites}
        className="
        cursor-pointer
        group/item
        w-6
        h-6
        lg:w-10
        lg:h-10
        border-white
        border-2
        rounded-full
        flex
        justify-center
        items-center
        transition
        hover:border-neutral-300
        ">
            <Icon className="text-white" size = {25} />

        </div>
    )
}

export default FavoriteButton;