/**
 * Copyright (c) 2026 AlertyAI
 * SPDX-License-Identifier: MIT
 */

/**
 * IndexNow Integration
 * Pings Bing and other supporting search engines to instantly index new content.
 */

export async function pingIndexNow(urls) {
  const key = process.env.INDEXNOW_KEY; // Should be stored in .env
  const host = 'smaranai.com'; // Replace with production domain

  if (!key) {
    console.warn('IndexNow key not found in environment variables. Skipping ping.');
    return;
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        urlList: Array.isArray(urls) ? urls : [urls],
      }),
    });

    if (response.ok) {
      console.log('✅ IndexNow ping successful');
    } else {
      console.error('❌ IndexNow ping failed:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error pinging IndexNow:', error);
  }
}
