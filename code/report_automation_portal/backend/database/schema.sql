CREATE TABLE user (username VARCHAR(64), pass_hash VARCHAR(256), user_type VARCHAR(16), user_role VARCHAR(16), PRIMARY KEY (username));

CREATE TABLE file_loc (report_id VARCHAR(64), report_type VARCHAR(64), report_date DATE, report_session VARCHAR(16), path_to_file VARCHAR(128), PRIMARY KEY (report_id));

CREATE TABLE gp_master_list (gp_code VARCHAR(16), gp_name VARCHAR(64), block VARCHAR(64), district VARCHAR(64), state VARCHAR(64), project_status VARCHAR(64), scope VARCHAR(8), rev_phase VARCHAR(64), remarks VARCHAR(128), PRIMARY KEY(gp_code));

CREATE TABLE olt_monthly (report_id VARCHAR(64), gp_code VARCHAR(16), state VARCHAR(64), district VARCHAR(64), block VARCHAR(64), olt_location VARCHAR(64), olt_location_code VARCHAR(64), olt_ip VARCHAR(64), olt_name VARCHAR(64), total_down_time VARCHAR(64), total_unreachable_time VARCHAR(64), olt_availability INTEGER, phase VARCHAR(16), PRIMARY KEY (gp_code));
ALTER TABLE olt_monthly ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE olt_monthly ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE olt_net_provider (report_id VARCHAR(64), gp_code VARCHAR(16),  network_provider VARCHAR(64), district VARCHAR(64), block VARCHAR(64), olt_location VARCHAR(64), olt_loc_code VARCHAR(64), olt_name VARCHAR(64), olt_ip VARCHAR(64), ems_name VARCHAR(64), point_asset_code VARCHAR(64), vendor VARCHAR(64), tech_name VARCHAR(64), version VARCHAR(64), olt_state VARCHAR(64), state_change_time DATETIME DEFAULT NULL, commission_date DATETIME DEFAULT NULL, nms_config_date DATETIME DEFAULT NULL, at_time DATETIME DEFAULT NULL, olt_added_time DATETIME DEFAULT NULL, h_status VARCHAR(64), h_status_change_time DATETIME DEFAULT NULL, started_user VARCHAR(64), conf_pic_count INTEGER, conf_pon_count INTEGER, conf_ont_count INTEGER, ems_conn_type VARCHAR(64), ems_vlan_id VARCHAR(8), mark_for_del VARCHAR(8), remarks VARCHAR(64), owner VARCHAR(64), PRIMARY KEY (gp_code));
ALTER TABLE olt_net_provider ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE olt_net_provider ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE ont_net_provider (report_id VARCHAR(64), gp_code VARCHAR(64), network_provider VARCHAR(64), district VARCHAR(64), block VARCHAR(64), panchayat VARCHAR(64), ont_location VARCHAR(64), ont_loc_code VARCHAR(64), ems_name VARCHAR(64), olt_location VARCHAR(64), ont_serial_no VARCHAR(64), olt_ip VARCHAR(64), point_asset_code VARCHAR(64), vendor VARCHAR(64), tech_name VARCHAR(64), version VARCHAR(64), physical_dist VARCHAR(32), pic_id INTEGER, pon_id INTEGER, ont_id INTEGER, ont_state VARCHAR(32), app_status VARCHAR(32), phys_status VARCHAR(64), spv VARCHAR(32), state_change_time DATETIME DEFAULT NULL, commission_date DATETIME DEFAULT NULL, at_time DATETIME DEFAULT NULL, nms_config_date DATETIME DEFAULT NULL, ont_added_time DATETIME DEFAULT NULL, ont_down_alarms VARCHAR(64), mark_for_delete VARCHAR(16), bharat_net VARCHAR(32), remarks VARCHAR(64), timestamp VARCHAR(32), PRIMARY KEY (gp_code));
ALTER TABLE ont_net_provider ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE ont_net_provider ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE ont_ticket (report_id VARCHAR(64), gp_code VARCHAR(64), state VARCHAR(64), district VARCHAR(64), block VARCHAR(64), panchayat VARCHAR(64), gp_location VARCHAR(64), gp_location_code VARCHAR(64), olt_location VARCHAR(64), ems_name VARCHAR(64), serial_no VARCHAR(64), alarm_cause VARCHAR(32), bin_type VARCHAR(32), current_alarm_name VARCHAR(64), bin_start_time DATETIME DEFAULT NULL, alarm_occurence_time DATETIME DEFAULT NULL, ticket_id VARCHAR(64), problem_description VARCHAR(64), ticket_created DATETIME DEFAULT NULL, ticket_type VARCHAR(32), category VARCHAR(64), olt_ip VARCHAR(64), vendor VARCHAR(64), tech_name VARCHAR(64), physical_dist VARCHAR(64), pic_id INTEGER, pon_id INTEGER, gp_id INTEGER, gp_state VARCHAR(32), app_status VARCHAR(64), physical_status VARCHAR(64), spv VARCHAR(32), state_change_time DATETIME DEFAULT NULL, commission_date DATETIME DEFAULT NULL, gp_added_date DATETIME DEFAULT NULL, owner VARCHAR(32), phase VARCHAR(32), temp_resolved VARCHAR(16), bharat_net INTEGER, PRIMARY KEY (gp_code));
ALTER TABLE ont_ticket ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE ont_ticket ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE unknown_ont (report_id VARCHAR(64), gp_code VARCHAR(64), network_provider VARCHAR(64), ont_location VARCHAR(64), ont_loc_code VARCHAR(64), ems_name VARCHAR(64), olt_location VARCHAR(64), ont_serial_no VARCHAR(64), olt_ip VARCHAR(64), point_asset_code VARCHAR(64), vendor VARCHAR(64), tech_name VARCHAR(64), version VARCHAR(64), physical_dist VARCHAR(32), pic_id INTEGER, pon_id INTEGER, ont_id INTEGER, ont_state VARCHAR(32), app_status VARCHAR(64), phys_status VARCHAR(64), spv VARCHAR(32), state_change_time DATETIME DEFAULT NULL, commission_date DATETIME DEFAULT NULL, at_time DATETIME DEFAULT NULL, nms_config_date DATETIME DEFAULT NULL, ont_added_time DATETIME DEFAULT NULL, ont_down_alarms VARCHAR(64), mark_for_delete VARCHAR(16), remarks VARCHAR(64), timestamp VARCHAR(64), PRIMARY KEY (gp_code));
ALTER TABLE unknown_ont ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE unknown_ont ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE mismatch_ont (report_id VARCHAR(64), gp_code VARCHAR(64), ont_name VARCHAR(64), olt_id INTEGER, olt_name VARCHAR(64), network_provider VARCHAR(64), panchayat VARCHAR(64), ont_location VARCHAR(64), ont_location_code VARCHAR(64), olt_location VARCHAR(64), ems VARCHAR(64), ont_serial_no VARCHAR(64), olt_ip VARCHAR(64), version VARCHAR(64), vendor VARCHAR(64), pic_id INTEGER, pon_id INTEGER, ont_id INTEGER, ont_type VARCHAR(64), olt_pic_pon_id INTEGER, gui_name VARCHAR(32), ont_state INTEGER, state VARCHAR(32), app_status VARCHAR(64), physical_status VARCHAR(64), state_change_time DATETIME DEFAULT NULL, nw_entry_time DATETIME DEFAULT NULL, log_time DATETIME DEFAULT NULL, remarks VARCHAR(64), PRIMARY KEY (gp_code));
ALTER TABLE mismatch_ont ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE mismatch_ont ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE olt_status (report_id VARCHAR(64), district VARCHAR(64), unreachable INTEGER, up INTEGER, grand_total INTEGER, percent_olt_up DECIMAL(5,2));
ALTER TABLE olt_status ADD PRIMARY KEY(report_id, district);
ALTER TABLE olt_status ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);

CREATE TABLE ont_status (report_id VARCHAR(64), district VARCHAR(64), down INTEGER, operational INTEGER, unknown_prev_up INTEGER, total_ont_up INTEGER, grand_total INTEGER, percent_ont_up DECIMAL(5,2));
ALTER TABLE ont_status ADD PRIMARY KEY(report_id, district);
ALTER TABLE ont_status ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
