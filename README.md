# 🛒 Shop API — Тестовое задание Backend-разработчик

✅ **Полностью реализовано ТЗ**: NestJS + PostgreSQL + Prisma + JWT + роли + бизнес-логика заказов

## 🚀 Быстрый старт

```bash
# 1. Установка
npm install

# 2. PostgreSQL (pgAdmin или Docker)
# Создай БД "shop" с пользователем postgres/password

# 3. Prisma миграция
npx prisma generate
npx prisma db push

# 4. Запуск
npm run start:dev


API: http://localhost:3000
Swagger Docs: http://localhost:3000/api-docs

📋 API Endpoints
AUTH (открытые):
POST /auth/register → {email, password}
POST /auth/login    → {email, password} → JWT

PRODUCTS (ADMIN only):
GET  /products?page=1&limit=10        # Список + пагинация
GET  /products/:id                    # Товар по ID
POST /products                        # Создать
PATCH /products/:id                   # Обновить
DELETE /products/:id                  # Soft delete

ORDERS (USER only):
POST /orders                          # Создать заказ с items
GET  /orders                          # Список заказов пользователя
GET  /orders/:id                      # Детали заказа

🧪 Примеры запросов
bash
# 1. Регистрация админа
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# 2. Логин → JWT
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# 3. Создать товар (нужен JWT)
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone","price":999,"stock":10}'

# 4. Создать заказ
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId":1,"quantity":2}
    ]
  }'

  🛠️ Технологии и обоснование
  | Технология          | Почему выбрана                            |
| ------------------- | ----------------------------------------- |
| NestJS + TypeScript | Модульная архитектура + строгая типизация |
| Prisma ORM          | Type-safe запросы + автогенерация типов   |
| PostgreSQL          | Decimal для денег + foreign keys          |
| JWT + Guards        | Стандарт авторизации + роли USER/ADMIN    |

Архитектура:
text
src/
├── auth/           # JWT Strategy + Guards
├── products/       # CRUD + пагинация + soft delete
├── orders/         # Stock validation + бизнес-логика
├── prisma/         # PrismaService + модуль
├── guards/         # JwtAuthGuard + RolesGuard
└── dto/            # class-validator


🎯 Реализация ТЗ
text
✅ CRUD Products:
  -  GET /products — пагинация (page/limit)
  -  POST/PATCH/DELETE — только ADMIN (RolesGuard)
  -  Soft delete через deletedAt

✅ Orders бизнес-логика:
  -  Проверка stock ДО создания
  -  Автоматическое уменьшение stock
  -  Расчет total = Σ(price × quantity)
  -  Связи: Order → OrderItem → Product

✅ Auth + JWT:
  -  POST /auth/register + login
  -  Роли: USER/ADMIN через enum
  -  JwtAuthGuard + RolesGuard

✅ Технические требования:
  -  Prisma: users/products/orders/order_items
  -  class-validator DTOs
  -  Swagger документация
  -  Модульная структура


  📊 Бизнес-логика заказов (ключевой момент)
  async createOrder(dto: CreateOrderDto, userId: number) {
  // 1. ✅ Проверка stock
  for (const item of dto.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product.stock < item.quantity) {
      throw new BadRequestException('Недостаточно товара');
    }
  }

  // 2. ✅ Расчет total
  let total = 0;
  for (const item of dto.items) {
    total += product.price * item.quantity;
  }

  // 3. ✅ Создание заказа + items
  const order = await prisma.order.create({
    data: { userId, total, items: { create: dto.items } }
  });
}

🧪 Локальная разработка
.env.example:

text
DATABASE_URL="postgresql://postgres:password@localhost:5432/shop?schema=public"
JWT_SECRET="supersecretkey"
PORT=3000