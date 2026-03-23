const request = require('supertest');
const app = require('../index');
describe('Electricity API Endpoints', () => {
// API 1: Total electricity usages for each year
    it('SUCCESS: should accurately calculate totals for each year from JSON', async () => {

        const fs = require("fs");

        // Helper: Load Data
        const loadData = (file) => JSON.parse(fs.readFileSync(`./data/${file}`, "utf8"));

        const rawData = loadData("electricity_usages_en.json");
        
        const expectedTotals = rawData.reduce((acc, curr) => {
            const year = curr.year;
            const totalUsage = Object.keys(curr)
                .filter((key) => key.endsWith("_kwh"))
                .reduce((sum, key) => sum + (curr[key] || 0), 0);
            
            acc[year] = (acc[year] || 0) + totalUsage;
            return acc;
        }, {});

        
        const res = await request(app).get('/api/usage/total-by-year');

        const expectedYears = Object.keys(expectedTotals);
        expect(res.statusCode).toBe(200);
        
        expectedYears.forEach(year => {
            expect(res.body).toHaveProperty(year);
            expect(res.body[year]).toEqual(expectedTotals[year]);
        });
    });

    it('FAILURE: should not return an array format', async () => {
        const res = await request(app).get('/api/usage/total-by-year');
        expect(Array.isArray(res.body)).toBe(false);
    });
//--------------------------------------------------------------------------------------------
// API 2: Total electricity users for each year
    it('SUCCESS: should accurately calculate totals for each year from JSON', async () => {

        const fs = require("fs");

        // Helper: Load Data
        const loadData = (file) => JSON.parse(fs.readFileSync(`./data/${file}`, "utf8"));

        const rawData = loadData("electricity_users_en.json");
        
        const expectedTotals = rawData.reduce((acc, curr) => {
            const year = curr.year;
            const totalUsers = Object.keys(curr)
                .filter((key) => key.endsWith("_count"))
                .reduce((sum, key) => sum + (curr[key] || 0), 0);
            
            acc[year] = (acc[year] || 0) + totalUsers;
            return acc;
        }, {});

        
        const res = await request(app).get('/api/users/total-by-year');

        const expectedYears = Object.keys(expectedTotals);
        expect(res.statusCode).toBe(200);
        
        expectedYears.forEach(year => {
            expect(res.body).toHaveProperty(year);
            expect(res.body[year]).toEqual(expectedTotals[year]);
        });
    });

    it('FAILURE: should not return an array format', async () => {
        const res = await request(app).get('/api/users/total-by-year');
        expect(Array.isArray(res.body)).toBe(false);
    });
//--------------------------------------------------------------------------------------------
// API 3: Usage of specific province by specific year
    it('SUCCESS: should return electricity usage for a specific province and year', async () => {
        const res = await request(app).get('/api/usage/Krabi/2565');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('province_name', 'Krabi');
        expect(res.body).toHaveProperty('year', 2565);
    });

    it('FAILURE: should return electricity usage for a specific province and year', async () => {
        const res = await request(app).get('/api/usage/Alberta/2566');
        expect(res.body.message).toBe('Data not found');
    });
//--------------------------------------------------------------------------------------------
// API 4: Users of specific province by specific year
    it('SUCCESS: should return electricity users for a specific province and year', async () => {
        const res = await request(app).get('/api/users/Krabi/2565');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('province_name', 'Krabi');
        expect(res.body).toHaveProperty('year', 2565);
    });
    it('FAILURE: should not return electricity users for a province that does not exist', async () => {
        const res = await request(app).get('/api/users/NonExistentProvince/2566');
        expect(res.body.message).toBe('Data not found');
    });
//--------------------------------------------------------------------------------------------
// API 5: Usage history by specific province
    it('SUCCESS: should return total electricity usage for each year', async () => {
        const res = await request(app).get('/api/pastusage/Krabi');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('FAILURE: should not return electricity usage for a province that does not exist', async () => {
        const res = await request(app).get('/api/pastusage/NonExistentProvince');
        expect(res.body).toEqual([]);
    });
//--------------------------------------------------------------------------------------------
// API 6: User history by specific province
    it('SUCCESS: should return total electricity users for each year', async () => {
        const res = await request(app).get('/api/pastusers/Krabi');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('FAILURE: should not return total electricity users for a province that does not exist', async () => {
        const res = await request(app).get('/api/pastusers/NonExistentProvince');
        expect(res.body).toEqual([]);
    });
});