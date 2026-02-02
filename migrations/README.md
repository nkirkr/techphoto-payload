# Миграции базы данных

## Применение миграций на сервере

### Способ 1: Через psql (рекомендуется)

```bash
# Подключитесь к вашей PostgreSQL базе данных
psql -h <your-host> -U <your-user> -d <your-database> -f migrations/add_all_responsive_fields.sql
```

### Способ 2: Через pgAdmin или другой GUI клиент

1. Откройте файл `migrations/add_all_responsive_fields.sql`
2. Скопируйте содержимое
3. Выполните в Query Tool вашего клиента

### Способ 3: Через код (если у вас есть доступ к серверу)

```javascript
const { Pool } = require('pg')
const fs = require('fs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URI
})

const sql = fs.readFileSync('migrations/add_all_responsive_fields.sql', 'utf8')

pool.query(sql)
  .then(() => console.log('Migration completed!'))
  .catch(err => console.error('Migration error:', err))
  .finally(() => pool.end())
```

## Что добавляет миграция

### 1. PhotoPages - Адаптивное изображение для Cycle секции
- `cycle_image_tablet_id` - изображение для планшетов (768px - 1024px)

### 2. HomePage - Адаптивные изображения для Details секции
- `details_background_image_tablet_id` - фоновое изображение для планшетов
- `details_background_image_mobile_id` - фоновое изображение для мобильных

### 3. Footer - Локализованные текстовые поля
- `description` - описание футера
- `nav_title` - заголовок навигации
- `contacts_title` - заголовок контактов
- `docs_title` - заголовок документации

### 4. Documents - Заголовки в творительном падеже
- `privacy_policy_title_instrumental` - "Политикой конфиденциальности"
- `terms_of_service_title_instrumental` - "Условиями использования"

## Проверка результата

После выполнения миграции скрипт автоматически покажет список добавленных колонок.

Вы также можете проверить вручную:

```sql
-- Проверка PhotoPages
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'photo_pages' AND column_name = 'cycle_image_tablet_id';

-- Проверка HomePage
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'home_page' 
AND column_name IN ('details_background_image_tablet_id', 'details_background_image_mobile_id');

-- Проверка Footer
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'footer_locales' 
AND column_name IN ('description', 'nav_title', 'contacts_title', 'docs_title');

-- Проверка Documents
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'documents_locales' 
AND column_name IN ('privacy_policy_title_instrumental', 'terms_of_service_title_instrumental');
```

## Безопасность

Миграция использует `IF NOT EXISTS` проверки, поэтому её безопасно запускать несколько раз. 

Если колонки уже существуют, они не будут изменены или пересозданы.
