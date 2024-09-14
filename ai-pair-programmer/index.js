// const fs = require('fs');

// global.console = { log: process.env['JEST_VERBOSE'] ? console.log : jest.fn(), };

// var data = "wtfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
// function write_to_file(data) {
// fs.appendFile('Output.txt', data, (err) => {
//     // In case of a error throw err.
//     if (err) throw err;
// });
// }

        document.getElementById('submitButton').addEventListener('click', async () => {
            var fileInput = document.getElementById('fileInput');
            if (fileInput.files.length === 0) {
                // write_to_file(fileInput.files.length + "");
                alert('Please select a file.');
                return;
            }

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            // write_to_file("hellowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");

            try {
                const response = await fetch('/clean', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const cleanedData = await response.json();
                // plotGraph(cleanedData);
            } catch (error) {
                console.error('Error:', error);
            }
        });

        function plotGraph(data) {
            const ctx = document.getElementById('myChart').getContext('2d');
            const age = data.map(item => item.Age);
            const survived = data.map(item => item.Survived);

            new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Age vs Survived',
                        data: data.map(item => ({ x: item.Age, y: item.Survived })),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Age'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Survived'
                            }
                        }
                    }
                }
            });
        }

        function plotGraph2(data) {
            const ctx = document.getElementById('myChart').getContext('2d');

            // Create age buckets of 10 years
            const ageBuckets = {};
            data.forEach(item => {
                const ageBucket = Math.floor(item.Age / 10) * 10;
                if (!ageBuckets[ageBucket]) {
                    ageBuckets[ageBucket] = { survived: 0, notSurvived: 0 };
                }
                if (item.Survived) {
                    ageBuckets[ageBucket].survived++;
                } else {
                    ageBuckets[ageBucket].notSurvived++;
                }
            });

            const labels = Object.keys(ageBuckets).map(bucket => `${bucket}-${+bucket + 9}`);
            const survivedData = Object.values(ageBuckets).map(bucket => bucket.survived);
            const notSurvivedData = Object.values(ageBuckets).map(bucket => bucket.notSurvived);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Survived',
                            data: survivedData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Not Survived',
                            data: notSurvivedData,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Age Buckets'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of People'
                            }
                        }
                    }
                }
            });
        }
