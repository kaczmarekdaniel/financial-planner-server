import { getUserPayments } from "../payments";

describe("getUserSpendings", () => {
    it("shouldn't return any user spendings", async () => {
        const req = {
            query: {
                month: "", 
            },
            user: {
                id: "d87dd261-4b68-4402-b2e6-cafe48296e08", 
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getUserPayments(req, res);

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

        await getUserPayments(req, res);

        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
			subscriptions: [
				{
				  id: '1effac26-44b8-42f7-80ea-c37ef9a17afb',
				  name: 'netflix',
				  userId: 'd87dd261-4b68-4402-b2e6-cafe48296e08',
				  paymentId: '1725280680863-hw8nfiu7r',
				  amount: 60,
				  category: 'subscriptions',
				  createdAt: new Date("2024-09-03T08:19:22.916Z"),
				  paid: false,
				  paidAt: null,
				  dueDate: 'Tue Sep 03 2024 00:00:00 GMT+0200 (Central European Summer Time)'
				}
			  ]
        });
    }); 
});

