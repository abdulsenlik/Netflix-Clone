import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    try {
        if( req.method === 'POST'){

             // Authenticate the user
            const { currentUser } = await serverAuth(req,res);

            // Validate the request body
            const { movieId } = req.body;
            if (!movieId || typeof movieId !== 'string') {
                return res.status(400).json({ error: 'Invalid or missing movieId' });
            }

            // Check if the movie exists
            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });
            if (!existingMovie) {
                return res.status(404).json({ error: 'Invalid movie ID' });
            }

            // Update the user's favoriteIds
            const updatedFavoriteIds = [...currentUser.favoriteIds, movieId];
            const updatedUser = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: updatedFavoriteIds,
                }
            });

            return res.status(200).json(updatedUser);

            // const {currentUser} = await serverAuth(req);

            // const {movieId} = req.body;

            // const existingMovie = await prismadb.movie.findUnique({

            //     where: {
            //         id: movieId,
            //     }
            // });

            // if(!existingMovie){
            //     throw new Error('Invalid ID');
            // }

            // const user = await prismadb.user.update({
            //     where: {
            //         email: currentUser.email || '',
            //     },
            //     data: {
            //         favoriteIds: {
            //             push: movieId,
            //         }
            //     }
            // });
            // return res.status(200).json(user);
        }

        if(req.method === 'DELETE'){

            const {currentUser} = await serverAuth(req,res);

            const {movieId} = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where:{
                    id: movieId,
                }
            });

        if(!existingMovie){
            throw new Error('Invalid ID');
        }

        const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

        const updatedUser = await prismadb.user.update({
            where: {
                email: currentUser.email || '',
            },
            data: {
                favoriteIds: updatedFavoriteIds,
            }
        });
        return res.status(200).json(updatedUser);
        }
        return res.status(405).end();
        
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}