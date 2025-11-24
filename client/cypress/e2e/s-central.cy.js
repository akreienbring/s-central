/*
  Author: André Kreienbring
  A simple e2e test that visits the main pages and opens some dialogs.
  For the test to work the backend server must be running.
  The test does not require any special test data (no devices or db data).
  But the default admin user must exist WITH STANDARD CREDENTIALS.
  If you changed the default admin user email or password
  please change the values below.
  The test does not login with a test user because this would require
  to create and later delete the user again. This would be more complex
  and error prone or rrequire a special test server setup.
  It also doesn't write any data, so it can be used on a production system. 
*/

describe('Just visit e2e test', () => {
  it('should work', () => {
    cy.clearLocalStorage('user');
    cy.visit('/');

    //*****Landing page*****
    cy.contains('S-Central');
    cy.containsBySel('landing_login_button').click(); //.should('exist');

    //*****Login page*****
    cy.contains('S-Central');
    const login_submit_button = cy.getBySel('login_submit_button');
    login_submit_button.should('have.attr', 'type', 'submit');
    login_submit_button.should('be.disabled');
    cy.getBySel('security_email_input').type('admin@sc.com');
    cy.getBySel('security_password_input').type('undlos');
    cy.getBySel('login_test_checkbox').click({ force: true }); //enable test mode

    //IMPORTANT: get the button again, because it was be re-rendered
    //cy.getBySel('login_submit_button').should('not.be.disabled').realClick(); //use this with chrome when having issues with the click
    cy.getBySel('login_submit_button').should('not.be.disabled').click(); //use this with firefox

    //*****Shellies page*****
    cy.containsBySel('info_lastUpdate_button');
    cy.testHeader();
    //***Shellies Tab***
    cy.contains('Shellies');
    cy.contains('Test'); //check for the name of the test device
    cy.contains('Example');
    cy.getBySel('shelly_openkvs_button').click();
    cy.contains('Klimakontrolle');
    cy.getBySel('shelly_openkvs_button').click();
    cy.contains('Klimakontrolle').should('not.exist');
    //***Controls Tab***
    cy.getBySel('shellies_control_tab').click();
    cy.contains('Test');
    cy.getBySel('shelly_brightness_slider').should('exist');
    cy.getBySel('shelly_white_slider').should('exist');
    cy.getBySel('shelly_multicolor_input').should('exist');
    //***Logs Tab***
    cy.getBySel('shellies_logs_tab').click();
    cy.contains('Test');
    cy.contains('Example');
    cy.contains('Watchdog');
    cy.contains('Please participate and help the project become better!');
    //***WS Tab***
    cy.getBySel('shellies_ws_tab').click();
    cy.contains('Test');
    cy.contains('NotifyStatus');
    cy.contains('NotifyEvent');
    cy.contains('NotifyFullStatus');
    //***List Tab***');
    cy.getBySel('shellies_list_tab').click();
    cy.contains('Test');
    cy.contains('Batch');
    cy.contains('PlusRGBWPM');

    //wifi dialog
    cy.getBySel('deviceshellyplusrgbwpm-30c92257d20c_openmenue_button').click();
    cy.getBySel('deviceshellyplusrgbwpm-30c92257d20c_openwifi_button').click();
    cy.getBySel('wifi_ssid_input').should('not.be.empty');
    cy.getBySel('device_closewifi_button').click();

    //*****Navigation*****
    const nav_open_button = cy.getBySel('nav_open_button');
    nav_open_button.click();
    const nav_item_dashboard = cy.getBySel('nav_item_dashboard');
    const nav_item_blog = cy.getBySel('nav_item_blog');
    const nav_item_user = cy.getBySel('nav_item_user');

    //*****Dashboard page*****
    nav_item_dashboard.click();
    cy.containsBySel('info_lastUpdate_button');
    cy.testHeader();
    cy.containsBySel('dashboard_shellies_component');
    cy.containsBySel('dashboard_totalconsumption_component');
    cy.containsBySel('dashboard_scripts_component');
    cy.containsBySel('dashboard_cloud_component');
    cy.containsBySel('dashboard_current_consumption_component');
    cy.containsBySel('dashboard_timeline_component');
    cy.containsBySel('chart_timeline_component');
    cy.containsBySel('chart_current_component');

    //*****User page*****
    nav_open_button.click();
    nav_item_user.click();
    cy.testHeader();
    cy.containsBySel('user_tablerow_component'); //default admin user
    cy.contains('Admin');
    cy.getBySel('user1_openmenue_button').click();
    cy.getBySel('user_editprofile_button').click();
    cy.testProfile();
    cy.getBySel('updateuser_close_button').click();

    //the create user dialog
    cy.containsBySel('users_newuser_button').click();
    let security_email_input = cy.getBySel('security_email_input');
    let profile_alias_input = cy.getBySel('profile_alias_input');
    let profile_firstname_input = cy.getBySel('profile_firstname_input');
    let profile_lastname_input = cy.getBySel('profile_lastname_input');
    cy.containsBySel('profile_role_select');
    let settings_home_select = cy.getBySel('settings_home_select');
    let account_save_button = cy.getBySel('account_save_button').should('be.disabled');
    //Fill out the form correctly and test the enabled state of the save button
    security_email_input.type('test@sc.com');
    profile_alias_input.type('testuser');
    profile_firstname_input.type('Test');
    profile_lastname_input.type('User');
    account_save_button.should('not.be.disabled');
    cy.getBySel('createuser_close_button').click();

    //*****Blog page*****
    nav_open_button.click();
    nav_item_blog.click();
    cy.testHeader();
    cy.contains('Blog');
    cy.getBySel('blog_newblog_button').click();
    cy.containsBySel('blogpost_title_input');
    cy.containsBySel('blogpost_content_component');
    cy.getBySel('blogpost_close_button').click();

    //*****Accout popover*****
    const open_account_popover_button = cy.getBySel('open_account_popover_button').click();
    const accountpopover_home_item = cy.getBySel('accountpopover_home_item');
    const accountpopover_profile_item = cy.getBySel('accountpopover_profile_item');
    const accountpopover_security_item = cy.getBySel('accountpopover_security_item');
    const accountpopover_settings_item = cy.getBySel('accountpopover_settings_item');

    //*****Account Profile dialog*****
    accountpopover_profile_item.click();
    cy.testProfile();

    //close and open again
    cy.getBySel('updateuser_close_button').click();
    open_account_popover_button.click();

    //*****Account Security dialog*****
    accountpopover_security_item.click();
    security_email_input = cy.getBySel('security_email_input');
    const security_password_input = cy.getBySel('security_password_input');
    const security_password2_input = cy.getBySel('security_password2_input');
    account_save_button = cy.getBySel('account_save_button').should('be.disabled');

    account_save_button.should('be.disabled');
    security_email_input.clear().type('test@sc.com');
    security_password_input.type('12345678');
    security_password2_input.type('12345678');
    account_save_button.should('not.be.disabled');

    //close and open again
    cy.getBySel('updateuser_close_button').click();
    open_account_popover_button.click();

    //*****Account Settings dialog*****
    accountpopover_settings_item.click();
    settings_home_select = cy.getBySel('settings_home_select');
    account_save_button = cy.getBySel('account_save_button').should('be.disabled');
    settings_home_select.invoke('val').then((val1) => {
      //using a saved constant does not work here for some reason
      settings_home_select = cy.getBySel('settings_home_select').parent().click();
      if (val1 === 'dashboard') {
        cy.getBySel('home_shellies_option').click();
      } else {
        cy.getBySel('home_dashboard_option').click();
      }

      // grab the input again and compare its previous value
      // to the current value
      settings_home_select.invoke('val').should((val2) => {
        expect(val1).not.to.eq(val2);
      });
    });
    cy.getBySel('account_save_button').should('not.be.disabled');

    //close and open again
    cy.getBySel('updateuser_close_button').click();
    open_account_popover_button.click();

    //*****logout*****
    cy.getBySel('accountpopover_logout_button').click();
    cy.contains('S-Central');
    cy.containsBySel('landing_login_button');
  });
});
