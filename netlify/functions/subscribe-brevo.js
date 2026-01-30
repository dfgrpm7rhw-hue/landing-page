exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = new URLSearchParams(event.body);
  const email = formData.get('email');
  const vorname = formData.get('vorname') || 'Freund:in';
  const nachname = formData.get('nachname') || '';

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    return { statusCode: 500, body: 'Brevo API-Key oder List-ID fehlen' };
  }

  if (!email) {
    return { statusCode: 400, body: 'E-Mail fehlt' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listId)],
        attributes: {
          FIRSTNAME: vorname,
          LASTNAME: nachname,
        },
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.message || 'Fehler beim Hinzufügen' }),
      };
    }

    // ✅ Redirect auf Danke-Seite
    return {
      statusCode: 302,
      headers: {
        Location: '/danke.html',
      },
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
