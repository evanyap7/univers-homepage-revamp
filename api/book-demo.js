/**
 * Univers Vercel Serverless Function: /api/book-demo
 * Handles enterprise demo requests, validates business contact details,
 * and formats submissions into CSV records.
 */

// In-memory buffer for serverless instance lifetime
let leadsBuffer = [
  {
    id: 'UNIV-DEMO-INIT-001',
    timestamp: '2026-09-17T12:00:00.000Z',
    name: 'Marcus Vance',
    email: 'm.vance@orix-renewables.com',
    organisation: 'ORIX Renewable Energy Management',
    inquiry: 'Scaling real-time AI power forecasting across 4.2 GW solar-plus-storage fleet.',
    status: 'SCHEDULED'
  }
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function toCsvString(records) {
  const header = 'ID,Timestamp,Name,Email,Organisation,Inquiry,Status\n';
  const rows = records.map((r) =>
    [
      escapeCsv(r.id),
      escapeCsv(r.timestamp),
      escapeCsv(r.name),
      escapeCsv(r.email),
      escapeCsv(r.organisation),
      escapeCsv(r.inquiry),
      escapeCsv(r.status || 'NEW')
    ].join(',')
  ).join('\n');
  return header + rows;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: export CSV or JSON
  if (req.method === 'GET') {
    if (req.query && req.query.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="univers_demo_leads.csv"');
      return res.status(200).send(toCsvString(leadsBuffer));
    }
    return res.status(200).json({
      success: true,
      count: leadsBuffer.length,
      leads: leadsBuffer
    });
  }

  // POST: create booking
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid JSON body' });
        }
      }

      const { name, email, organisation, inquiry } = body || {};

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'Please provide a valid name.' });
      }

      if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({ error: 'Please provide a valid business email address.' });
      }

      if (!organisation || typeof organisation !== 'string' || organisation.trim().length < 2) {
        return res.status(400).json({ error: 'Please provide your organization name.' });
      }

      if (!inquiry || typeof inquiry !== 'string' || inquiry.trim().length < 5) {
        return res.status(400).json({ error: 'Please describe your inquiry or decarbonization goals.' });
      }

      const id = `UNIV-DEMO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestamp = new Date().toISOString();

      const newLead = {
        id,
        timestamp,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        organisation: organisation.trim(),
        inquiry: inquiry.trim(),
        status: 'PENDING_DISPATCH'
      };

      leadsBuffer.unshift(newLead);
      if (leadsBuffer.length > 200) leadsBuffer.pop();

      const csvRow = [
        escapeCsv(newLead.id),
        escapeCsv(newLead.timestamp),
        escapeCsv(newLead.name),
        escapeCsv(newLead.email),
        escapeCsv(newLead.organisation),
        escapeCsv(newLead.inquiry),
        escapeCsv(newLead.status)
      ].join(',');

      return res.status(200).json({
        success: true,
        message: 'Demo booking registered successfully.',
        id,
        lead: newLead,
        csvRow
      });
    } catch (err) {
      console.error('[Univers API] Booking error:', err);
      return res.status(500).json({ error: 'Internal server error while booking demo.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
