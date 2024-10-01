import { calculateMonthsBetweenTimestamps, getUserPayments } from "../payments";
import { getUserSpendings } from "../spendings";

describe("getUserSpendings", () => {
    it("shouldn't return any user spendings", async () => {
        const req = {
            query: {
                month: "", // Provide a valid month here
            },
            user: {
                id: "d87dd261-4b68-4402-b2e6-cafe48296e08", // Mock the user ID if the handler expects it
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUserSpendings(req, res);

        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid date specified.",
        });
    });

    it("should return user spendings", async () => {
        const req = {
            query: {
                month: "1725349808755", // Provide a valid month here
            },
            user: {
                id: "d87dd261-4b68-4402-b2e6-cafe48296e08", // Mock the user ID if the handler expects it
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUserSpendings(req, res);

        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            food: [
                {
                    id: "78f777f9-ad8f-41e0-959f-a48522312e29",
                    name: "lidl",
                    userId: "d87dd261-4b68-4402-b2e6-cafe48296e08",
                    amount: 200,
                    category: "food",
                    createdAt: new Date("2024-09-03T08:00:45.535Z"),
                    updatedAt: new Date("2024-09-03T08:00:54.834Z"),
                },
            ],
        });
    });
});

describe("calculateMonthsBetweenTimestamps", () => {
    it("should return 0 when start and end dates are the same", () => {
        const startDate = new Date("2023-08-01");
        const endDate = new Date("2023-08-01");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(0);
    });

    it("should return 1 when start and end dates are in the same month but different days", () => {
        const startDate = new Date("2023-08-01");
        const endDate = new Date("2023-08-15");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(0);
    });

    it("should return 1 when start and end dates are one month apart", () => {
        const startDate = new Date("2023-08-01");
        const endDate = new Date("2023-09-01");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(1);
    });

    it("should return 12 when start and end dates are one year apart", () => {
        const startDate = new Date("2022-08-01");
        const endDate = new Date("2023-08-01");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(12);
    });

    it("should return the correct number of months when crossing years", () => {
        const startDate = new Date("2022-11-15");
        const endDate = new Date("2023-03-14");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(4);
    });

    it("should return the correct number of months when the end day is earlier in the month than the start day", () => {
        const startDate = new Date("2023-01-31");
        const endDate = new Date("2023-01-28");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(0);
    });

    it("should return the correct number of months for multiple years and different days", () => {
        const startDate = new Date("2020-01-15");
        const endDate = new Date("2023-08-14");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(43);
    });

    it("should handle leap years correctly", () => {
        const startDate = new Date("2020-02-29");
        const endDate = new Date("2021-02-28");
        expect(calculateMonthsBetweenTimestamps(startDate, endDate)).toBe(12);
    });
});
