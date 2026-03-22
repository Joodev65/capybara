export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { url, urlv2 } = req.query;

    if (!url && !urlv2) {
      return res.status(400).json({
        status: false,
        message: "url atau urlv2 parameter required",
        author: "JooModdss"
      });
    }

    if (url) {
      const api = `https://www.sankavollerei.com/download/aio?apikey=planaai&url=${encodeURIComponent(url)}`;

      const response = await fetch(api);
      const data = await response.json();

      return res.status(200).json({
        ...data,
        creator: "JooModdss"
      });
    }
 
    if (urlv2) {
      const api = `https://api.xte.web.id/v1/download/allinone?url=${encodeURIComponent(urlv2)}`;

      let response;
      let attempts = 0;

      while (attempts < 3) {
        try {
          response = await fetch(api);
          if (response.ok) break;
        } catch (err) {}

        attempts++;

        if (attempts < 3) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!response || !response.ok) {
        return res.status(500).json({
          status: false,
          message: "API XTE tidak merespon",
          author: "JooModdss"
        });
      }

      const data = await response.json();

      return res.status(200).json({
        ...data,
        creator: "JooModdss"
      });
    }

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message
    });
  }
}
