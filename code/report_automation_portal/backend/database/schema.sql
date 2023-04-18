CREATE TABLE user (username VARCHAR(64), pass_hash VARCHAR(256), user_type VARCHAR(16), user_role VARCHAR(16), PRIMARY KEY (username));

CREATE TABLE file_loc (report_id VARCHAR(64), report_type VARCHAR(64), report_date DATE, report_session VARCHAR(16), path_to_file VARCHAR(128), PRIMARY KEY (report_id));

CREATE TABLE gp_master_list (gp_code VARCHAR(16), gp_name VARCHAR(64), block VARCHAR(64), district VARCHAR(64), state VARCHAR(64), project_status VARCHAR(64), scope VARCHAR(8), rev_phase VARCHAR(64), remarks VARCHAR(128), PRIMARY KEY(gp_code));

CREATE TABLE olt_monthly (report_id VARCHAR(64), gp_code VARCHAR(16), state VARCHAR(64), district VARCHAR(64), block VARCHAR(64), olt_location VARCHAR(64), olt_location_code VARCHAR(64), olt_ip VARCHAR(64), olt_name VARCHAR(64), total_down_time VARCHAR(64), total_unreachable_time VARCHAR(64), olt_availability INTEGER, phase VARCHAR(16), PRIMARY KEY (gp_code));
ALTER TABLE olt_monthly ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE olt_monthly ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);

CREATE TABLE olt_net_provider (report_id VARCHAR(64), gp_code VARCHAR(16),  network_provider VARCHAR(64), district VARCHAR(64), block VARCHAR(64), olt_location VARCHAR(64), olt_loc_code VARCHAR(64), olt_name VARCHAR(64), olt_ip VARCHAR(64), ems_name VARCHAR(64), point_asset_code VARCHAR(64), vendor VARCHAR(64), tech_name VARCHAR(64), version VARCHAR(64), olt_state VARCHAR(64), state_change_time DATETIME DEFAULT NULL, commission_date DATETIME DEFAULT NULL, nms_config_date DATETIME DEFAULT NULL, at_time DATETIME DEFAULT NULL, olt_added_time DATETIME DEFAULT NULL, h_status VARCHAR(64), h_status_change_time DATETIME DEFAULT NULL, started_user VARCHAR(64), conf_pic_count INTEGER, conf_pon_count INTEGER, conf_ont_count INTEGER, ems_conn_type VARCHAR(64), ems_vlan_id VARCHAR(8), mark_for_del VARCHAR(8), remarks VARCHAR(64), owner VARCHAR(64), PRIMARY KEY (gp_code));
ALTER TABLE olt_net_provider ADD FOREIGN KEY (report_id) REFERENCES file_loc(report_id);
ALTER TABLE olt_net_provider ADD FOREIGN KEY (gp_code) REFERENCES gp_master_list(gp_code);
