import { Router } from 'express';
import { matches } from '../db/schema';
import { db } from '../db/db';
import { getMatchStatus } from '../utils/match-status';

export const matchRouter = Router();

matchRouter.get('/matches', (req, res) => {
  res.status(200).json({ message: 'Matches List' });
});


matchRouter.post('/', async(req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid match data', details: JSON.stringify(parsed.error) });
    }

        // return res.status(400).json({ errors: parsed.error.errors });

        try {
            const [event] = await db.insert(matches).values({
                ...parsed.data,
                status: getMatchStatus(parsed.data.startTime, parsed.data.endTime),
                startTime: new Date(parsed.data.startTime),
                endTime: new Date(parsed.data.endTime),
                homeScore : parsed.data.homeScore || 0,
                awayScore : parsed.data.awayScore || 0,
            }).returning();
            // const [event] = await db.insert(matches).values({
            //     sport: parsed.data.sport,
            //     homeTeam: parsed.data.homeTeam,
            //     awayTeam: parsed.data.awayTeam,
            //     status: getMatchStatus(parsed.data.startTime, parsed.data.endTime),
            //     startTime: new Date(parsed.data.startTime),
            //     endTime: new Date(parsed.data.endTime),
            //     homeScore: parsed.data.homeScore || 0,
            //     awayScore: parsed.data.awayScore || 0,
            // }).returning();


            res.status(201).json({ message: 'Match created successfully', match: event });

        }catch (err) {
            res.status(500).json({ error: 'Failed to create match',
                details:
                JSON.stringify(err) });
        

            // console.error('Error parsing match data:', err);
            // return res.status(400).json({ error: 'Invalid match data format' });
        // }
    }
});