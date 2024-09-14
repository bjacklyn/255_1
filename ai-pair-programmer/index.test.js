/**
 * @jest-environment jsdom
 */

// index.test.js
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import fetchMock from 'jest-fetch-mock';
const fs = require('fs');


function write_to_testfile(data) {
fs.writeFile('TestOutput.txt', data, (err) => {
    // In case of a error throw err.
    if (err) throw err;
});
}

fetchMock.enableMocks();

beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = `
        <h1>Upload CSV and Display Graph</h1>
        <input type="file" id="fileInput" accept=".csv">
        <button id="submitButton">Submit</button>
        <canvas id="myChart" width="400" height="200"></canvas>
    `;
    require('./index'); // Assuming your script is in index.js
});

afterEach(() => {
    fetchMock.resetMocks();
});

test('should upload file and handle response', async () => {
    const file = new File(['name,age\nJohn,30\nJane,25'], 'test.csv', { type: 'text/csv' });
    const fileInput = document.getElementById('fileInput');
    const submitButton = document.getElementById('submitButton');

    Object.defineProperty(fileInput, 'files', {
        value: [file],
    });

    write_to_testfile(fileInput.files.length + "");

    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    fireEvent.click(submitButton);

    await new Promise(process.nextTick); // Wait for async operations

    expect(fetchMock).toHaveBeenCalledWith('/clean', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('should alert if no file is selected', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const submitButton = document.getElementById('submitButton');

    fireEvent.click(submitButton);

    await new Promise(process.nextTick); // Wait for async operations

    expect(alertMock).toHaveBeenCalledWith('Please select a file.');
    alertMock.mockRestore();
});

test('should handle network error', async () => {
    const file = new File(['name,age\nJohn,30\nJane,25'], 'test.csv', { type: 'text/csv' });
    const fileInput = document.getElementById('fileInput');
    const submitButton = document.getElementById('submitButton');

    Object.defineProperty(fileInput, 'files', {
        value: [file],
    });

    fetchMock.mockRejectOnce(new Error('Network response was not ok'));

    fireEvent.click(submitButton);

    await new Promise(process.nextTick); // Wait for async operations

    expect(fetchMock).toHaveBeenCalledWith('/clean', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledTimes(1);
});
