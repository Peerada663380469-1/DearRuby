const https = require('https');

https.get('https://www.adlibhotels.co/bangkok/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract font links
    const fonts = data.match(/<link[^>]*href="[^"]*(font|typekit|google)[^"]*"[^>]*>/ig);
    console.log("FONTS:\n", fonts ? fonts.join('\n') : "No font links found");
    
    // Extract inline styles with colors
    const styles = data.match(/style="[^"]*color[^"]*"/ig);
    console.log("\nSTYLES:\n", styles ? styles.slice(0, 10).join('\n') : "No inline styles found");
    
    // Extract CSS links
    const cssLinks = data.match(/<link[^>]*rel="stylesheet"[^>]*href="[^"]*"[^>]*>/ig);
    console.log("\nCSS LINKS:\n", cssLinks ? cssLinks.join('\n') : "No CSS links found");
    
    // Extract first 50 lines to see body/html tags
    console.log("\nHEAD:\n", data.split('\n').slice(0, 50).join('\n'));
  });
});
