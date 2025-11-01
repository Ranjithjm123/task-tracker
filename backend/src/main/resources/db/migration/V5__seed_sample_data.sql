-- Sample user (password: password123)
INSERT INTO users (username, email, password) VALUES
('demo', 'demo@example.com', '$2a$10$rKZqVXVxZ8X8gVZM5QJyJeYMpGYk5kZxQHKWqZqZqZqZqZqZqZqZq');

-- Sample tasks
INSERT INTO tasks (user_id, title, description, task_type, frequency, is_active) VALUES
(1, 'Morning Workout', 'Complete 30 minutes of exercise', 'DAILY', 1, TRUE),
(1, 'Read Book', 'Read at least 20 pages', 'DAILY', 1, TRUE),
(1, 'Drink Water', 'Drink 8 glasses throughout the day', 'DAILY', 8, TRUE),
(1, 'Project Deadline', 'Complete project report', 'DEADLINE', 1, TRUE);

-- Update the deadline task with an actual deadline (7 days from now)
UPDATE tasks SET deadline = CURRENT_TIMESTAMP + INTERVAL '7 days' WHERE title = 'Project Deadline';