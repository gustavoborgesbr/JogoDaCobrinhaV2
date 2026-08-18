const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve all static files in the root directory
app.use(express.static(__dirname));

// Ensure fallback to index.html for SPA if needed (though it seems it's just index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
