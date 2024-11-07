## Prompt:
> Implement a command for telegram chat bot `/report` @Codebase following grammyjs @Grammy 

## Solution:

Я допоможу вам реалізувати команду `/report` для Telegram бота використовуючи grammY. Ось реалізація:

```typescript
import { Bot } from "grammy";

const { TELEGRAM_BOT_TOKEN, ADMIN_CHAT_ID } = process.env;

if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN не визначено");
if (!ADMIN_CHAT_ID) throw new Error("ADMIN_CHAT_ID не визначено"); 

const bot = new Bot(TELEGRAM_BOT_TOKEN);

// Обробка команди /report
bot.command("report", async (ctx) => {
  try {
    const reportText = ctx.message.text.split("/report")[1]?.trim();
    
    if (!reportText) {
      await ctx.reply("Будь ласка, додайте текст скарги після команди /report");
      return;
    }

    // Отримуємо інформацію про користувача
    const reporter = ctx.from;
    const reporterInfo = `Скарга від: ${reporter.first_name} ${reporter.last_name || ''} (@${reporter.username || 'без username'})`;
    
    // Формуємо повне повідомлення для адміністратора
    const fullReport = `
📝 Нова скарга!

${reporterInfo}
ID користувача: ${reporter.id}

📌 Текст скарги:
${reportText}

⏰ Час: ${new Date().toLocaleString('uk-UA')}
`;

    // Надсилаємо скаргу адміністратору
    await bot.api.sendMessage(ADMIN_CHAT_ID, fullReport);
    
    // Підтверджуємо користувачу
    await ctx.reply("Дякуємо! Вашу скаргу було надіслано адміністраторам. Ми розглянемо її якнайшвидше.");

  } catch (error) {
    console.error('Помилка при обробці команди /report:', error);
    await ctx.reply("Вибачте, сталася помилка при обробці вашої скарги. Будь ласка, спробуйте пізніше.");
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Помилка при обробці webhook:', error);
    return new Response('Помилка', { status: 500 });
  }
}
```

Для роботи цього коду вам потрібно:
Додати змінну середовища ADMIN_CHAT_ID - це ID чату адміністратора або групи адміністраторів, куди будуть надходити скарги.
Оновити ваш .env файл:
```
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_CHAT_ID=your_admin_chat_id
```

## Ця реалізація:
Перевіряє наявність тексту скарги після команди
Збирає інформацію про користувача, який надіслав скаргу
Форматує повідомлення з усією необхідною інформацією
Надсилає скаргу адміністраторам
Підтверджує отримання скарги користувачу
Обробляє помилки та надає відповідний зворотний зв'язок
Користувачі можуть використовувати команду так:
```
/report текст скарги
/report Спам від користувача @spammer в чаті
```
Адміністратори отримають форматоване повідомлення з усією необхідною інформацією про скаргу та користувача, який її надіслав.
Цей код відповідає вашому існуючому коду1 та використовує найкращі практики роботи з командами в grammY.