import fs from 'node:fs';
const raw = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of raw.split('\n')) {
	const m = line.match(/^\s*([A-Za-z_]+)\s*=\s*(.*)\s*$/);
	if (m) env[m[1]] = m[2].trim();
}
const { createClient } = await import('@libsql/client');
const db = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
const step = process.argv[2];
const workdir = '/private/var/folders/hz/55f9rv851g3f61fk0ngdlwh40000gn/T/opencode';
if (step === 'meta') {
	const u = await db.execute({
		sql: `SELECT imagekit_private_key FROM auth_user WHERE id = 'q5257kmkin0vw8x'`
	});
	fs.writeFileSync(`${workdir}/ik.env`, `KEY=${u.rows[0].imagekit_private_key}\n`);
	console.log('meta written');
}
if (step === 'finalize') {
	const [filePath, w, h] = process.argv.slice(3);
	await db.execute({
		sql: `UPDATE images SET path = ?, width = ?, height = ? WHERE id = 1098`,
		args: [filePath, Number(w), Number(h)]
	});
	const chk = await db.execute({ sql: `SELECT id, path, width, height FROM images WHERE id = 1098` });
	console.log(JSON.stringify(chk.rows[0]));
}
