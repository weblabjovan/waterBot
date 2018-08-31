module.exports = text => {
	const reply = {
		"content_type": "text",
		"title": text,
		"payload": text,
	}

	return reply;
}