CREATE TABLE user (username VARCHAR(64), pass_hash VARCHAR(256), user_type VARCHAR(16), user_role VARCHAR(16));

CREATE TABLE fileLoc (report_type VARCHAR(64), report_date DATE, report_session VARCHAR(16), path_to_file VARCHAR(128));