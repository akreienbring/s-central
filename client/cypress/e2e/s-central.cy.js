/*
  Author: André Kreienbring
  A simple e2e test that visits the main pages and opens some dialogs.
  For the test to work:
  - the backend server must be running.
  - the default admin user must exist WITH STANDARD CREDENTIALS AND STANDARD PROFILE VALUES.
 
  If you changed the default admin user email or password please change the values below.
  The test copies the 'broker.db' to 'test.db' and uses the copy when data is created or altered
  Hence the test can be used in a production system. 

  Tip: use cy.pause() to pause a test at any point
*/

describe('Just visit e2e test', () => {
  it('should work', () => {
    const waitTime = 3000;

    cy.clearLocalStorage('user');
    cy.clearAllSessionStorage();
    cy.visit('/');

    cy.window().then((win) => {
      if (win.scconfig.LANDING_PAGE === 'blog') {
        //*****Landing page*****
        cy.contains('S-Central');
        cy.getBySel('landing_login_button').click(); //.should('exist');
      }
      //*****Login page*****
      cy.contains('S-Central');
      cy.getBySel('login_submit_button').should('have.attr', 'type', 'submit');
      cy.getBySel('login_submit_button').should('be.disabled');
      cy.getBySel('security_email_input').type('admin@sc.com');
      cy.getBySel('security_password_input').type('undlos');
      cy.getBySel('login_test_checkbox').click({ force: true }); //enable test mode
      //cy.getBySel('login_submit_button').should('not.be.disabled').realClick(); //use this with chrome when having issues with the click
      cy.getBySel('login_submit_button').should('not.be.disabled').click(); //use this with firefox

      //*****Shellies page*****
      cy.getBySel('info_lastUpdate_button');
      cy.testHeader();
      //***Shellies Tab***
      cy.contains('Shellies');
      //check for the name of the test devices, script names and KVS button
      cy.getBySel('shelly_card_Test').should('exist');
      cy.getBySel('shelly_card_Test2').should('exist');
      cy.contains('Example');
      cy.getBySel('shelly_openkvs_button_Test').click();
      cy.contains('Klimakontrolle');
      cy.getBySel('shelly_openkvs_button_Test').click();
      cy.contains('Klimakontrolle').should('not.exist');
      //check the filter function
      cy.getBySel('filter_open_button').click();
      cy.getBySel('filter_gen_checkbox_0').should('exist');
      cy.getBySel('filter_model_checkbox_0').click({ force: true });
      cy.getBySel('filter_submit_button').click();
      cy.getBySel('shelly_card_Test').should('exist');
      cy.getBySel('shelly_card_Test2').should('not.exist');
      cy.getBySel('filter_open_button').click();
      cy.getBySel('filter_clear_button').click();
      cy.getBySel('filter_submit_button').click();
      cy.getBySel('shelly_card_Test2').should('exist');
      //check the sort function
      // define and check the order by this array
      const order = ['Test', 'Test2'];
      cy.getBySelLike('shelly_card').each(($el, index) => {
        cy.wrap($el).contains(order[index]);
      });
      cy.getBySel('sort_open_button').click();
      cy.getBySel('sort_option_Model').click({ force: true });
      // define and check the NEW order by this array
      const neworder = ['Test2', 'Test'];
      cy.getBySelLike('shelly_card').each(($el, index) => {
        cy.wrap($el).contains(neworder[index]);
      });
      // create a scenes for user Admin
      cy.getBySel('scene_autocomplete_component').should('exist');
      cy.getBySel('action_area_Test').should('exist');
      cy.getBySel('action_area_Test').click();
      cy.getBySel('scene_autocomplete_component').click();
      cy.getBySel('scene_autocomplete_component').type('testscene');
      cy.getBySel('scene_option').should('exist');
      cy.getBySel('scene_option').click();
      cy.wait(waitTime);
      //***Controls Tab***
      cy.getBySel('shellies_control_tab').click();
      cy.getBySel('shelly_card_Test').should('exist');
      cy.getBySel('shelly_brightness_slider').should('exist');
      cy.getBySel('shelly_white_slider').should('exist');
      cy.getBySel('shelly_multicolor_input').should('exist');
      cy.getBySel('shelly_setcopysource_button').should('exist');
      //***Logs Tab***
      cy.getBySel('shellies_logs_tab').click();
      cy.getBySel('shelly_card_Test').should('exist');
      cy.contains('Example');
      cy.contains('Please participate and help the project become better!');
      //***WS Tab***
      cy.getBySel('shellies_ws_tab').click();
      cy.getBySel('shelly_card_Test').should('exist');
      cy.contains('NotifyStatus');
      cy.contains('NotifyEvent');
      cy.contains('NotifyFullStatus');
      //***List/Batch Tab***');
      cy.getBySel('shellies_list_tab').click();
      cy.contains('Test');
      cy.contains('Batch');
      cy.contains('PlusRGBWPM');

      //wifi dialog
      cy.getBySel('deviceshellyplusrgbwpm-30c92257d20c_openmenue_button').click();
      cy.getBySel('deviceshellyplusrgbwpm-30c92257d20c_openwifi_button').click();
      // cy.getBySel('wifi_ssid_input').should('not.be.empty');
      cy.getBySel('wifi_ssid_input').should('not.have.value', ''); //not.be.empty is not working sometimes
      cy.getBySel('device_closewifi_button').click();

      //*****Navigation*****
      cy.getBySel('nav_open_button').click();

      //*****Dashboard page*****
      cy.getBySel('nav_item_dashboard').click();
      cy.getBySel('info_lastUpdate_button');
      cy.testHeader();
      cy.getBySel('dashboard_shellies_component').should('exist');
      cy.getBySel('dashboard_totalconsumption_component').should('exist');
      cy.getBySel('dashboard_scripts_component').should('exist');
      cy.getBySel('dashboard_cloud_component').should('exist');
      cy.getBySel('dashboard_current_consumption_component').should('exist');
      cy.getBySel('dashboard_timeline_component').should('exist');
      cy.getBySel('chart_timeline_component').should('exist');
      cy.getBySel('chart_current_component').should('exist');

      //*****User page*****
      cy.getBySel('nav_open_button').click();
      cy.getBySel('nav_item_user').click();
      cy.testHeader();
      cy.getBySel('user_tablerow_component'); //default admin user
      cy.contains('Admin');
      cy.getBySel('Admin_openmenue_button').click();
      cy.getBySel('user_editprofile_button').click();
      cy.getBySel('profile_firstname_input').should('exist');
      cy.getBySel('profile_lastname_input').should('exist');
      cy.getBySel('profile_role_select').should('exist');
      cy.getBySel('account_save_button').should('be.disabled');
      cy.getBySel('profile_firstname_input').clear().type('André');

      //add a random number to be able to run the test more than once
      const lastname = 'Kreienbring_' + Math.floor(Math.random() * 100).toString();
      cy.getBySel('profile_lastname_input').clear().type(lastname);

      cy.getBySel('account_save_button').should('not.be.disabled');
      //save the user profile...
      cy.getBySel('account_save_button').click();
      cy.wait(waitTime);
      //and check for the entered values
      cy.contains('André');
      cy.contains('Kreienbring');

      cy.getBySel('updateuser_close_button').click();

      //the create user dialog
      cy.getBySel('users_newuser_button').click();
      cy.getBySel('profile_role_select');
      cy.getBySel('account_save_button').should('be.disabled');
      //Fill out the form correctly and test the enabled state of the save button
      cy.getBySel('security_email_input').type('test@sc.com');
      cy.getBySel('profile_alias_input').type('testuser');
      cy.getBySel('profile_firstname_input').type('Testme');
      cy.getBySel('profile_lastname_input').type('Please');
      cy.getBySel('account_save_button').should('not.be.disabled');
      //create a test user
      cy.getBySel('account_save_button').click();
      cy.wait(waitTime);
      cy.getBySel('createuser_close_button').click();
      cy.contains('testuser');
      //add only the device named "Test" to the created user
      cy.getBySel('testuser_openmenue_button').click();
      cy.getBySel('user_adddevices_button').click();
      // if the test is run more then once the state of the checkbox should be considered
      // but that is currently not possible because of:
      // https://github.com/mui/material-ui/issues/20364#issuecomment-681066039
      cy.getBySel('adddevices_checkbox_0').click({ force: true });
      cy.getBySel('adddevices_save_button').click();
      cy.wait(waitTime);
      cy.getBySel('adddevices_close_button').click();

      //*****Blog page*****
      cy.getBySel('nav_open_button').click();
      cy.getBySel('nav_item_blog').click();
      cy.testHeader();
      cy.contains('Blog');
      cy.getBySel('blog_newblog_button').click();
      cy.getBySel('blogpost_submit_button').should('be.disabled');
      cy.getBySel('blogpost_title_input').should('exist');
      // taken from: https://github.com/tiavina-mika/mui-tiptap-editor/blob/main/__tests__/e2e/text-editor.stories.spec.ts
      cy.getBySel('text-editor-input').should('exist');
      //create a new blogpost
      cy.getBySel('blogpost_title_input').type('Test Title');
      cy.getBySel('text-editor-input').type('Test Content');
      cy.getBySel('blogpost_submit_button').should('not.be.disabled');
      cy.getBySel('blogpost_submit_button').click();
      cy.wait(waitTime);
      cy.getBySel('blogpost_close_button').click();
      cy.contains('Test Title');
      cy.contains('Test Content');
      //delete the created blogpost
      cy.getBySel('blog_openmenue_button_0').click();
      cy.getBySel('blog_delete_button_0').click();
      cy.getBySel('blog_reallydelete_button_0').click();
      cy.contains('Test Title').should('not.exist');
      cy.contains('Test Content').should('not.exist');

      //*****Accout popover*****
      cy.getBySel('open_account_popover_button').click();
      cy.getBySel('accountpopover_home_item');

      //*****Account Profile dialog*****
      cy.getBySel('accountpopover_profile_item').click();
      cy.getBySel('profile_firstname_input').should('exist');
      cy.getBySel('profile_lastname_input').should('exist');
      cy.getBySel('profile_role_select').should('exist');
      //check if the previously entered values exist.
      cy.getBySel('profile_firstname_input').should('have.value', 'André');
      cy.getBySel('profile_lastname_input').should('have.value', lastname);
      cy.getBySel('account_save_button').should('be.disabled');
      //clear the  fields to make a second testrun possible
      cy.getBySel('profile_firstname_input').clear();
      cy.getBySel('profile_lastname_input').clear();
      cy.getBySel('account_save_button').click();
      cy.wait(waitTime);

      //close and open again
      cy.getBySel('updateuser_close_button').click();
      cy.getBySel('open_account_popover_button').realClick(); //this closes the popover
      cy.getBySel('open_account_popover_button').click();

      //*****Account Security dialog*****
      //change the password of the admin user
      cy.getBySel('accountpopover_security_item').click();
      cy.getBySel('account_save_button').should('be.disabled');
      cy.getBySel('security_password_input').type('12345678');
      cy.getBySel('security_password2_input').type('12345678');
      cy.getBySel('account_save_button').should('not.be.disabled');
      cy.getBySel('account_save_button').click();
      cy.wait(waitTime);

      //close and open again
      cy.getBySel('updateuser_close_button').click();
      cy.getBySel('open_account_popover_button').realClick(); //this closes the popover
      cy.getBySel('open_account_popover_button').click();

      //*****Account Settings dialog*****
      cy.getBySel('accountpopover_settings_item').click();
      cy.getBySel('account_save_button').should('be.disabled');

      let settings_home_select = cy.getBySel('settings_home_select');
      settings_home_select.invoke('val').then((val1) => {
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
      cy.getBySel('open_account_popover_button').realClick(); //this closes the popover

      //*****logout*****
      cy.getBySel('open_account_popover_button').click();
      cy.getBySel('accountpopover_logout_button').click();
      cy.contains('S-Central');

      //Login again with the created test user
      if (win.scconfig.LANDING_PAGE === 'blog') {
        //*****Landing page*****
        cy.contains('S-Central');
        cy.getBySel('landing_login_button').click(); //.should('exist');
      }
      //*****Login page*****
      cy.contains('S-Central');
      cy.getBySel('login_submit_button').should('have.attr', 'type', 'submit');
      cy.getBySel('login_submit_button').should('be.disabled');
      cy.getBySel('security_email_input').type('test@sc.com');
      cy.getBySel('security_password_input').type('undlos');
      cy.getBySel('login_test_checkbox').click({ force: true }); //enable test mode
      //cy.getBySel('login_submit_button').should('not.be.disabled').realClick(); //use this with chrome when having issues with the click
      cy.getBySel('login_submit_button').should('not.be.disabled').click(); //use this with firefox

      //*****Navigation*****
      cy.getBySel('nav_open_button').click();
      cy.getBySel('nav_item_user').should('not.exist'); //because test user has the user role

      //*****Shellies Page*****
      cy.getBySel('nav_item_shellies').click();
      cy.getBySel('shelly_card_Test').should('exist');
      //because only the device with the name test was assigned:
      cy.getBySel('shelly_card_Test2').should('not.exist');
      //check for the created scene
      cy.getBySel('scene_autocomplete_component').click();
      cy.contains('testscene').should('not.exist');

      //*****logout*****
      cy.getBySel('open_account_popover_button').click();
      cy.getBySel('accountpopover_logout_button').click();
      cy.contains('S-Central');

      if (win.scconfig.LANDING_PAGE === 'blog') {
        //*****Landing page*****
        cy.contains('S-Central');
        cy.getBySel('landing_login_button').click(); //.should('exist');
      }
      //*****Login page*****
      //Log in as Admin again by using the changed password
      cy.getBySel('login_submit_button').should('have.attr', 'type', 'submit');
      cy.getBySel('login_submit_button').should('be.disabled');
      cy.getBySel('security_email_input').type('admin@sc.com');
      cy.getBySel('security_password_input').type('12345678');
      cy.getBySel('login_test_checkbox').click({ force: true }); //enable test mode
      //cy.getBySel('login_submit_button').should('not.be.disabled').realClick(); //use this with chrome when having issues with the click
      cy.getBySel('login_submit_button').should('not.be.disabled').click(); //use this with firefox

      //*****Navigation*****
      cy.getBySel('nav_open_button').click();
      cy.getBySel('nav_item_user').click();

      //delete the created testuser
      cy.getBySel('testuser_openmenue_button').click();
      cy.getBySel('user_delete_button').click();
      cy.getBySel('user_reallydelete_button').click();
      cy.contains('testuser').should('not.exist');

      //*****Navigation to Shellies Page*****
      cy.getBySel('nav_open_button').click();
      cy.getBySel('nav_item_shellies').click();
      //delete the created scene
      cy.getBySel('scene_autocomplete_component').click();
      cy.getBySel('scene_option').should('exist');
      cy.getBySel('scene_option').click();
      cy.getBySel('scene_delete_button').should('exist');
      cy.getBySel('scene_delete_button').click();
      cy.wait(waitTime);

      //*****logout*****
      cy.getBySel('open_account_popover_button').click();
      cy.getBySel('accountpopover_logout_button').click();
      cy.contains('S-Central');

      //reset the admin password
      cy.getBySel('user_resetpw_link').should('exist');
      cy.getBySel('user_resetpw_link').click();
      cy.wait(waitTime);
      cy.getBySel('security_email_input').type('admin@sc.com');
      cy.getBySel('user_resetpw_link').click();
    }); // wait for window().then
  }); // it
}); // describe
