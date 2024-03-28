const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://atkjuytbypwcmslvxqhv.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0a2p1eXRieXB3Y21zbHZ4cWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTcyNzMsImV4cCI6MjAyMzQzMzI3M30.N6rfo2aOFWxtmHiAYi0xE8GE0azXXBHH11ZlVJT8BUk';
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.listen(8080, () => {
    console.log('listening on port 8080');
    console.log('http://localhost:8080/f4/qualifying/10');
    console.log('http://localhost:8080/f4/qualifying/1010');
    console.log('http://localhost:8080/f4/qualifying/910');
    console.log('http://localhost:8080/f4/races/1950/1955');
    console.log('http://localhost:8080/f4/races/1960/1961');
    console.log('http://localhost:8080/f4/races/1990/1990');
    console.log('http://localhost:8080/f4/drivers/name/ab/limit/2');
    console.log('http://localhost:8080/f4/drivers/name/de/limit/3');
    console.log('http://localhost:8080/f4/drivers/name/mi/limit/4');
});

app.get('/f4/qualifying/:raceId', async (req, res) => {
    const { raceId } = req.params;
    try {
        const { data, error } = await supabase
            .from('qualifying')
            .select(`*, races!inner (name, round, year, date),  drivers!inner(driverRef, code, forename, surname),
                 constructor!inner (name, constructorRef, nationality)`)
            .eq('raceId', raceId)
            .order('position', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No data found for the specified raceId' });
        }
        res.send(data);
    } catch (error) {
        console.error('Error fetching race data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

app.get('/f4/races/:st/:en', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .gte('year', req.params.st)
        .lte('year', req.params.en)
        .order('year', { ascending: true });
    res.send(data);
});

app.get('/f4/drivers/name/:sch/limit/:lim', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .ilike('surname', req.params.sch + "%")
        .limit(req.params.lim)
        .order('surname', { ascending: true });
    res.send(data);
}); 