# BlockVerse — Firebase edition

В этой папке только Firebase. Supabase не используется.

## 1. Firebase Console
1. Открой проект `blockverse-4a366`.
2. Authentication → Sign-in method → включи Email/Password.
3. Firestore Database → создай базу данных, если ещё не создана.

## 2. Опубликуй правила
1. Firestore Database → Rules.
2. Замени содержимое правилами из `firestore.rules`.
3. Нажми Publish.

## 3. Загрузка на GitHub
Распакуй ZIP и загрузи СОДЕРЖИМОЕ папки в корень репозитория.
В корне должны быть `index.html`, `app.js`, `firebase-config.js`, `firestore.rules`, `README.md`.
Не загружай только ZIP: GitHub Pages его не распакует.

## 4. GitHub Pages
Settings → Pages → Deploy from a branch → main → /(root) → Save.
Открой `https://teamnovalauncher.github.io/BlockVerse/`.

## Важно
Это стартовая версия регистрации и входа, не полная копия Roblox.
Первый пользователь, успешно записавший документ владельца в Firestore, получает роль Creator.
Никому не отправляй пароли или приватные ключи Firebase.
