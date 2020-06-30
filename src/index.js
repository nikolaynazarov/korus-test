function statement(invoice) {
	let totalAmount = 0;
	let volumeCredits = 0;
	let result = '';

	const formatCurrency = new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 2,
	}).format;

	for (let perf of invoice.performances) {
		let thisAmount = 0;

		switch (perf.type) {
			case 'tragedy':
				thisAmount = 40000;
				if (perf.audience > 30) {
					thisAmount += 1000 * (perf.audience - 30);
				}
				break;
			case 'comedy':
				thisAmount = 30000;
				if (perf.audience > 20) {
					thisAmount += 10000 + 500 * (perf.audience - 20);
				}
				thisAmount += 300 * perf.audience;
				break;
			default:
				throw new Error(`неизвестный тип: ${perf.type}`);
		}
		totalAmount += thisAmount;

		// Добавление бонусов
		volumeCredits += Math.max(perf.audience - 30, 0);
		// Дополнительный бонус за каждые 10 комедий
		if (perf.type === 'comedy') volumeCredits += Math.floor(perf.audience / 10);
		// Вывод строки счета
		result +=
			`Счет для: ${invoice.customer}\n` +
			`${perf.playId}: ${formatCurrency(thisAmount / 100)}` +
			` (${perf.audience} мест)\n` +
			`Итого с вас: ${formatCurrency(totalAmount / 100)}\n` +
			`Вы заработали ${volumeCredits} бонусов\n\n`;
	}
	// Возвращаем счет на каждое представление
	return result;
}

// Для более реального примера получения данных сделаем имитацию задержки ответа от сервера в 2 секунды
// И получим данные с помощью fetch()
setTimeout(() => {
	fetch('./data/invoices.json')
		.then(response => response.json())
		.then(data => console.log(statement(data[0])));
}, 2000);
