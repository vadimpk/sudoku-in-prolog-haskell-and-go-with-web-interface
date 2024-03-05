export class PrologServer {
    async solveSudoku(grid) {
        try {
            return await fetch('http://localhost:8080/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "grid": grid }),
            }).then(response => response.json());
        } catch (error) {
            console.error("Error making request:", error);
            return null;
        }
    }

    async checkSolution(grid) {
        try {
            const response = await fetch('http://localhost:8080/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "grid": grid }),
            });
            return response.status == 200;
        } catch (error) {
            console.error("Error making request:", error);
            return false;
        }
    }

    async generateGrid() {
        try {
            return await fetch('http://localhost:8080/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json());
        } catch (error) {
            console.error("Error making request:", error);
            return null;
        }
    }
}

export class GolangServer {
    async solveSudoku(grid) {
        try {
            return await fetch('http://localhost:8081/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grid),
            }).then(response => response.json());
        } catch (error) {
            console.error("Error making request:", error);
            return null;
        }
    }

    async checkSolution(grid) {
        try {
            const response = await fetch('http://localhost:8081/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grid),
            });
            return response.status == 200;
        } catch (error) {
            console.error("Error making request:", error);
            return false;
        }
    }

    async generateGrid() {
        try {
            return await fetch('http://localhost:8081/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json());
        } catch (error) {
            console.error("Error making request:", error);
            return null;
        }
    }
}