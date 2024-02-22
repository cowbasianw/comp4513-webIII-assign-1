const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://atkjuytbypwcmslvxqhv.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0a2p1eXRieXB3Y21zbHZ4cWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTcyNzMsImV4cCI6MjAyMzQzMzI3M30.N6rfo2aOFWxtmHiAYi0xE8GE0azXXBHH11ZlVJT8BUk';
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/f4/circuit', async (req, res) => {
    const { data, error } = await supabase
        .from('circuit')
        .select();
    res.send(data);

});
app.get('/f4/circuit/:circuitRef', async (req, res) => {
    try {
        const { circuitRef } = req.params;
        const { data, error } = await supabase
            .from('circuit')
            .select()
            .eq('circuitRef', circuitRef)
            .single(); // Ensure only one record is returned
        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).json({ error: 'Circuit not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching circuit:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/f4/circuit/season/:year', async (req, res) => {
    try {
        const { year } = req.params;

        // Retrieve race data for the specified year
        const { data: racesData, error: racesError } = await supabase
            .from('races')
            .select('circuitId')
            .eq('year', year);

        if (racesError) {
            throw racesError;
        }

        if (!racesData || racesData.length === 0) {
            return res.status(404).json({ error: 'No race data found for the specified year' });
        }

        // Extract circuit IDs from race data
        const circuitIds = racesData.map(race => race.circuitId);

        // Retrieve circuit details based on circuit IDs
        const { data: circuitsData, error: circuitsError } = await supabase
            .from('circuit')
            .select()
            .in('circuitId', circuitIds)
            .order('circuitId', { ascending: true });

        if (circuitsError) {
            throw circuitsError;
        }
        if (!circuitsData || circuitsData.length === 0) {
            return res.status(404).json({ error: 'No circuit data found for the specified year' });
        }
        res.json(circuitsData);
    } catch (error) {
        console.error('Error fetching circuit data for the season:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/seasons', async (req, res) => {
    const { data, error } = await supabase
        .from('seasons')
        .select();
    res.send(data);
});
app.get('/f4/constructor', async (req, res) => {
    const { data, error } = await supabase
        .from('constructor')
        .select();
    res.send(data);
});
app.get('/f4/constructor/:ref', async (req, res) => {
    try {
        const { ref } = req.params;
        const { data, error } = await supabase
            .from('constructor')
            .select()
            .eq('constructorRef', ref)
            .single(); // Ensure only one record is returned
        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).json({ error: 'constructor not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching constructor:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select();
    res.send(data);
});
app.get('/f4/drivers/:ref', async (req, res) => {
    try {
        const { ref } = req.params;
        const { data, error } = await supabase
            .from('drivers')
            .select()
            .eq('driverRef', ref)
            .single(); // Ensure only one record is returned
        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).json({ error: 'drivers not found' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching drivers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/drivers/race/:raceId', async (req, res) => {
    try {
        const { raceId } = req.params;

        // Retrieve result data for the specified raceId
        const { data: resultData, error: resultError } = await supabase
            .from('result')
            .select('driverId')
            .eq('raceId', raceId);

        if (resultError) {
            throw resultError;
        }

        if (!resultData || resultData.length === 0) {
            return res.status(404).json({ error: 'No result data found for the specified id' });
        }

        // Extract driverIds from result data
        const driverIds = resultData.map(result => result.driverId);

        // Retrieve driver details based on driverIds
        const { data: driversData, error: driversError } = await supabase
            .from('drivers')
            .select()
            .in('driverId', driverIds); // Filter by all driverIds

        if (driversError) {
            throw driversError;
        }

        if (!driversData || driversData.length === 0) {
            return res.status(404).json({ error: 'No driver data found for the specified driverIds' });
        }

        res.json(driversData);
    } catch (error) {
        console.error('Error fetching driver data for the race:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/races/season/:year', async (req, res) => {
    try {
        const { year } = req.params;

        // Retrieve race data for the specified year
        const { data: racesData, error: racesError } = await supabase
            .from('races')
            .select()
            .eq('year', year)
            .order('round', { ascending: true }); // Order by round in ascending order

        if (racesError) {
            throw racesError;
        }

        if (!racesData || racesData.length === 0) {
            return res.status(404).json({ error: 'No race data found for the specified year' });
        }

        res.json(racesData);
    } catch (error) {
        console.error('Error fetching race data for the season:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/races/season/:year/:round', async (req, res) => {
    try {
        const { year, round } = req.params;

        // Retrieve race data for the specified year and round
        const { data: raceData, error: raceError } = await supabase
            .from('races')
            .select()
            .eq('year', year)

        if (raceError) {
            throw raceError;
        }

        if (!raceData || raceData.length === 0 || round < 1 || round > raceData.length) {
            return res.status(404).json({ error: 'No race data found for the specified year and round' });
        }

        res.json(raceData[round - 1]); // Adjust round index to match array index
        console.log(raceData);
    } catch (error) {
        console.error('Error fetching race data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/races/circuit/:ref', async (req, res) => {
    try {
        const { ref } = req.params;
        const { data: circuitData, error: circuitError } = await supabase
            .from('circuit')
            .select() // Select all fields from both tables
            .eq('circuitRef', ref)
        if (circuitError) {
            throw circuitError;
        }

        if (!circuitData || circuitData.length === 0) {
            return res.status(404).json({ error: 'No race data found for the specified year' });
        }

        // Extract circuit IDs from circuit data
        const circuitIds = circuitData.map(circuit => circuit.circuitId);
        const { data: raceData, error: raceError } = await supabase
            .from('races')
            .select()
            .eq('circuitId', circuitIds)
            .order('year', { ascending: true }); // Order by round in ascending order

        if (raceError) {
            throw raceError;
        }

        if (!raceData || raceData.length === 0) {
            return res.status(404).json({ error: 'No race data found for the specified year' });
        }

        res.json(raceData);
    } catch (error) {
        console.error('Error fetching race data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/f4/drivers/name/:startsWith/limit/:limit', async (req, res) => {
    const { startsWith, limit } = req.params;
    const limitNumber = parseInt(limit);
    // Fetch drivers whose surname begins with the provided value, sorted by surname in ascending order, and limited to the provided number
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .ilike('surname', `${startsWith}%`) // Using ilike for case-insensitive matching
        .order('surname', { ascending: true })
        .limit(limitNumber);

    res.send(data);

});

app.listen(8080, () => {
    console.log('listening on port 8080');
    console.log('http://localhost:8080/f4/seasons');
    console.log('http://localhost:8080/f4/circuit/monaco');
    console.log('http://localhost:8080/f4/circuit/season/2020');
    console.log('http://localhost:8080/f4/drivers');
    console.log('http://localhost:8080/f4/constructor');
    console.log('http://localhost:8080/f4/drivers/hamilton');
    console.log('http://localhost:8080/f4/constructor/mclaren');
    console.log('http://localhost:8080/f4/drivers/race/1106');
    console.log('http://localhost:8080/f4/races/season/2020');
    console.log('http://localhost:8080/f4/races/season/2022/4');
    console.log('http://localhost:8080/f4/races/circuit/monza');

});