CREATE TABLE task_completions (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    completion_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    completed_all BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE(task_id, completion_date)
);

CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_task_completions_date ON task_completions(completion_date);