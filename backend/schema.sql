DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS outreach CASCADE;
DROP TABLE IF EXISTS interviews_events CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

CREATE TABLE applications (
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

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(100), --  Recruiter, Hiring Manager, Technical Interviewer
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE outreach(
  id SERIAL PRIMARY KEY,
  application_id INT REFERENCES applications(id) ON DELETE CASCADE,
  contact_id INT REFERENCES contacts(id) ON DELETE CASCADE,
  contact_method VARCHAR(255),
  follow_up TIMESTAMP,
  status VARCHAR(255), -- First contact, set up meeting, etc.
  note_id INT REFERENCES notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interviews_events (
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

CREATE TABLE notifications(
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