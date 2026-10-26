
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  role_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Applied', --  Applied, Interviewing, Offer, Rejected
  date_applied DATE NOT NULL,
  salary_range VARCHAR(100),
  job_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(100), --  Recruiter, Hiring Manager, Technical Interviewer
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS interviews_events (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE, -- NULL if event is general ( Job Fair)
  event_type VARCHAR(100) NOT NULL, --  Phone Screen, Technical Interview, Job Fair
  event_date TIMESTAMP NOT NULL,
  event_time TIMESTAMP,
  location TEXT, -- Zoom/Teams link or physical location
  outcome VARCHAR(100), --Scheduled, Passed, Pending
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS notifications(
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  title VARCHAR(225) NOT NULL,
  message TEXT,
  notification_type VARCHAR (100) NOT NULL,  -- follow up - 24hr/48hr, interview in 1 day, custom
  reminder_date TIMESTAMP NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);