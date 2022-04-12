
/////////////////////// - Add section start - /////////////////////////////
$("#myTab .tab").click(function (e) {
    $("#topvalidations,#bottomvalidations").hide();
    $('#docerrormsg,#foldererrormsg').text('');
    $("#AddFolderviewDocuments  input").prop("checked", false);
});

// profile validation
var profilevalidation = "";
function validateProfile() {
    var isvalid = true;
    var dodnum = returnValue(dodnumberId.val());
    var dutyPH = returnValue(dutyPhoneId.val());
    profilevalidation = "";
    if (isEmpty(dodnumberId)) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + dodnumberId.attr("Id") + "' >Your DoD ID Number</span></li>";
        isvalid = false;
    } else if (!validateDoDID(dodnum) || !$.isNumeric(dodnum)) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + dodnumberId.attr("Id") + "' >Enter valid DoD ID Number</span></li>";
        isvalid = false;
    } else if (!isEmpty(dodnumberId) && !isEmpty(assignedComponentId)) { //&& (dodnumberId.val() != UPDODNumber)){
        var data = validateUniqueDODID(dodnumberId.val(), assignedComponentId.val(), USER_ID);
        if (data.length > 0) {
            profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + dodnumberId.attr("Id") + "' >Enter DoD ID Number already exist.</span></li>";
            isvalid = false;
        }
    }

    if (isEmpty(assignedComponentId)) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + assignedComponentId.attr("Id") + "' >Your Assigned Component</span></li>";
        isvalid = false;
    }

    if (isEmpty(statusId)) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + statusId.attr("Id") + "' >Your Status</span></li>";
        isvalid = false;
    }

    if (isEmpty(rankId)) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + rankId.attr("Id") + "' >Your Rank</span></li>";
        isvalid = false;
    }

    if (isEmpty(dutyPhoneId)) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + dutyPhoneId.attr("Id") + "' >Your Contact Phone Number</span></li>";
        isvalid = false;
    } else if ((dutyPH.length > 16) || (!validatePhone(dutyPhoneId.val().trim())) || (dutyPH.length < 10)) {
        isvalid = false;
        profilevalidation += "<li><span tabindex='0' name=" + dutyPhoneId.attr("Id") + ">Enter valid Contact Phone Number</span></li>";
    }

    if (!$('#inputRadioPASCODEYes').is(":checked") && !$('#inputRadioPASCODENo').is(":checked") && $('#inputRadioPASCODENo').is(":visible")) {
        profilevalidation += "<li><span  tabindex='0' name='inputRadioPASCODEYes' >Do you know the Unit PASCODE?</span></li>";
        isvalid = false;
    }

    if (isEmpty($('#inputTextPASCODE')) && !$('#inputTextPASCODE').is('[readonly]') && $('#inputTextPASCODE').is(":visible")) {
        profilevalidation += "<li><span  tabindex='0' name='" + $('#inputTextPASCODE').attr("Id") + "' >PASCODE</span></li>";
        isvalid = false;
    } else if (!isEmpty($('#inputTextPASCODE')) && validateData('PASCODE', $('#inputTextPASCODE').val(), allPascodeData) && !$('#inputTextPASCODE').is('[readonly]')) {
        profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + $('#inputTextPASCODE').attr("Id") + "' >Enter valid PASCODE</span></li>";
        isvalid = false;
    } else { //this section validates if PAS Code        
        if (isEmpty(majcomId) && majcomId.is(":visible")) {
            profilevalidation = profilevalidation + "<li><span  tabindex='0' name='" + majcomId.attr("Id") + "' >MAJCOM/DRU/FOA</span></li>";
            isvalid = false;
        }

        if (isEmpty(installationId) && !installationId.is('[readonly]') && installationId.is(":visible")) {
            profilevalidation += "<li><span  tabindex='0' name='" + installationId.attr("Id") + "' >Installation/Assigned Location</span></li>";
            isvalid = false;
        } else if (!isEmpty(installationId) && validateData('Installation', installationId.val(), selMajcomPascodeData) && !installationId.is('[readonly]')) {
            profilevalidation += "<li><span  tabindex='0' name='" + installationId.attr("Id") + "' >Search and Select valid Installation/Assigned Location</span></li>";
            isvalid = false;
        }

        if (isEmpty(organizationId) && !organizationId.is('[readonly]') && organizationId.is(":visible")) {
            profilevalidation += "<li><span  tabindex='0' name='" + organizationId.attr("Id") + "' >Organization/Unit Name</span></li>";
            isvalid = false;
        } else if (!isEmpty(organizationId) && validateData('Organization', organizationId.val(), selInstallationPascodeData) && !organizationId.is('[readonly]')) {
            profilevalidation += "<li><span  tabindex='0' name='" + organizationId.attr("Id") + "' >Search and Select valid Organization/Unit Name</span></li>";
            isvalid = false;
        }

        if (isEmpty(pascodeCPTSId) && !pascodeCPTSId.is('[readonly]')) {
            profilevalidation += "<li><span  tabindex='0' name='" + pascodeCPTSId.attr("Id") + "' >Servicing Comptroller</span></li>";
            isvalid = false;
        }
    }
    return isvalid;
}

function closeValidations() {
    $(".formvalidations").hide();
    $(".formvalidations ul").html("");
}

$(".validationclose").click(function () {
    closeValidations();
});


// profile update
function updateProfile(acionst) {
    $("#" + acionst + "validations").hide();
    var dutyEmail = USER_DUTYEMAIL;
    $("#dodDuplicateErrMsg").hide();
    loderShow();
    $(".formactionbuttons a").prop("disabled", true).addClass('disabled');
    closeValidations();
    sessionStorage.setItem('IsForm_' + sitename, false);
    var rank = returnValue(rankId.val());
    var rankIdVal = tochecknotnullvalues($('#ddlRank option:selected').attr("data-id"));
    var dodnumber = returnValue(dodnumberId.val());
    var dutyPhone = returnValue(dutyPhoneId.val());
    var pascode = returnValue($('#inputTextPASCODE').val());
    var pascodeIdVal = getPASCODEId(pascode);
    var status = returnValue(statusId.val());
    var assignedcomponent = returnValue($('#ddlYourAssignedComponent option:selected').val());
    customerUserID = USER_ID;

    if (validateProfile()) {
        
        if (profileId != undefined) { //if profile already exist
            if (!isProfileDataChanged) {
                profilevalidation = "";
                $("#" + acionst + "validations").show();
                loderHide();
                $("#" + acionst + "validations h1 span").html('No changes detected');
                $("#" + acionst + "validationsection").html(profilevalidation);
                $(".formactionbuttons a").prop("disabled", false).removeClass('disabled');

            } else {
                var profileitemurl = SITE_URL + "/_api/web/lists/GetByTitle('" + USERPROFILE_LIST + "')/items(" + profileId + ")";
                var profiletypeoflist = GetItemTypeForListName(USERPROFILE_LIST);
                var d = $.Deferred();
                var itemObj = {
                    RankId: rankIdVal,
                    disName: USER_DISPLAYNAME,
                    DutyEmail: dutyEmail,
                    DutyPhone: dutyPhone,
                    PassCodeId: pascodeIdVal,
                    DODNumber: dodnumber,
                    AssignedComponent: assignedcomponent
                }
                var items = {
                    __metadata: {
                        "type": profiletypeoflist
                    }
                };
                var upitems = {
                    ID: profileId,
                    Rank: rank,
                    cpts: cpts,
                };
                $.extend(items, itemObj);
                $.extend(upitems, itemObj);
                UpdateData(profileitemurl, items, d, true).done(function (data) {
                    UPDODNumber = UserDODNumber = dodnumber;
                    UPDisplayName = UserDispayName = USER_DISPLAYNAME;
                    UPRank = UserRank = rank;
                    UserRankID = rankIdVal;
                    UPDutyPhone = UserDutyPhone = dutyPhone;
                    UPPASCODEID = UserPasscodeId = pascodeIdVal;
                    UPDutyEmail = UserDutyEmail = dutyEmail;
                    UPPASCODE = UserPASCode = pascode;
                    UPOrganization = UserOrganization = organizationId.val();
                    UPInstallations = UserInstallation = installationId.val();
                    UPCPTS = UserCPTS = pascodeCPTSId.val();
                    UPStatus = UserStatus = status;
                    UPAssignedComponent = ProfileUserAssignedComponent = assignedcomponent;
                    UPMajcom = UserMajcom = majcomId.val();
                    fnSuccess(dodnumber);
                });
                d.fail(function (ex) {
                    loderHide();
                    var errCode = ex.error.code;
                    var msg;
                    if (errCode.includes("SPDuplicateValuesFoundException")) {
                        $("#dodDuplicateErrMsg").show();
                    } else {
                        msg = ex.error.message.value;
                        alert(msg);
                    }
                });
            }
        } else { //if profile not exist
            var profileitemurl = SITE_URL + "/_api/web/lists/GetByTitle('" + USERPROFILE_LIST + "')/items";
            var profiletypeoflist = GetItemTypeForListName(USERPROFILE_LIST);
            var items = {
                __metadata: {
                    "type": profiletypeoflist
                },
                RankId: rankIdVal,
                disName: USER_DISPLAYNAME,
                DutyEmail: dutyEmail,
                DutyPhone: dutyPhone,
                PassCodeId: pascodeIdVal,
                DODNumber: dodnumber,
                CustomerID: customerUserID,
                AssignedComponent: assignedcomponent
            }
            addData(profileitemurl, items, true).done(function (data) {
                var result = data.d;
                if (tochecknotnullvalues(result) != "") {
                    profileId = result.ID;
                }

                fnSuccess(dodnumber);
            }).fail(function (e) {
                loderHide(); //remove "working on it" overlay
                isProfileDataChanged = false;
                var errCode = e.error.code;
                var msg;
                if (errCode.includes("SPDuplicateValuesFoundException")) {
                    $("#dodDuplicateErrMsg").show();
                } else {
                    msg = e.error.message.value;
                    alert(msg);
                }
            });
        }
        //}
    } else {
        $("#" + acionst + "validations").show();
        loderHide();
        isProfileDataChanged = false;
        $("#" + acionst + "validations h1 span").html('Please fill the below mandatory fields');
        $("#" + acionst + "validationsection").html(profilevalidation);
    }
}

function fnSuccess(dodnumber) {
    isProfileDataChanged = false;
    $('#userinformationsec').text('').hide();
    loderHide();
    showUserConfirmationMessage()
}

//User confirmation to Navigate to Inquiry Page
function showUserConfirmationMessage() {
    $('#pascodeyesorno').removeClass('flexpascodeyes');
    $("#dialog-confirm").show();
    $("#dialog-confirm p").text(USER_CONFIRM_MSG);
    $("#dialog-confirm").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        closeOnEscape: false, // Do not close dialog on press Esc button
        open: function (event, ui) { // It'll hide Close button
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        buttons: {
            "Yes": function () {
                $(this).dialog("close");
                window.location.href = SITE_URL + "/SitePages/CreateInquiry.aspx";
            },
            "No": function () {
                $(this).dialog("close");
                getUserInfo();
                $.when(userprofile_d).done(function () {
                    userProfileDetails = curr_userprofile;
                    populateProfileData(userProfileDetails);
                    $('#inputTextMajcom,#inputTextOrganizationUnitName,#inputTextInstallation,#inputTextServicingComptroller').attr("readonly", true);
                });
            }
        }
    });
}

//update function calling 
$(".update-btn").click(function () {
    var classname = this.className
    var hasclass = "top"
    if (classname.indexOf(hasclass) != -1) {
        updateProfile('top')
    } else {
        updateProfile('bottom')
    }
});

//************** auto complete functions **************//

/* Organization details populate & change  functions */
$(document).on("change", "#inputRadioPASCODEYes,#inputRadioPASCODENo", function () {
    resetPASCODEDetails();
    var selComponent = returnValue($('#ddlYourAssignedComponent option:selected').val());
    if ($('#inputRadioPASCODEYes').is(":checked")) {
        $('.passcodesec').hide();
        $('#inputPASCODEDiv').remove();
        $('#pascodeyesorno').after(pascodeinputHtml);

        if (profileId != undefined & UPAssignedComponent == selComponent)
            $('.passcodesec').show();
        else {
            $('.passcodesec').hide();
            $('#pascodeyesorno,#inputPASCODEDiv').addClass('flexpascodeyes');
        }

        $('#inputTextMajcom,#inputTextOrganizationUnitName,#inputTextInstallation,#inputTextServicingComptroller').attr("readonly", true);
        majcomId.hide();
        $('#inputTextMajcom,#inputPASCODEDiv').show();
        $('#inputTextPASCODE').attr("readonly", false);
        if (UPAssignedComponent == selComponent)
            setOrganizationDetails();
    }
    if ($("#inputRadioPASCODENo").is(":checked")) {
        $('.passcodesec').hide();
        $('#inputPASCODEDiv').remove();
        $('#servicingcpts').after(pascodeinputHtml);
        if (profileId != undefined && UPAssignedComponent == selComponent){
            $('#inputTextMajcom').attr("readonly", false);
            $('.passcodesec').show();
        }            
        else
            $('#pascodeyesorno,#inputPASCODEDiv').removeClass('flexpascodeyes');

        $('#inputTextOrganizationUnitName,#inputTextInstallation').attr("readonly", false);
        $('#inputTextPASCODE').attr("readonly", true);
        //$('.passcodesec,#inputPASCODEDiv').show()
        $('#inputPASCODEDiv').show()
        majcomId.show();
        $('#inputTextMajcom').hide();       
        
        populateMajcom();
        if (UPAssignedComponent == selComponent) {
            setOrganizationDetails();
            $('#inputTextPASCODE').val(UPPASCODE).attr('data-identifier', UPPASCODE).attr("data-id", UPPASCODEID);
            $('#sectionOrganization,#sectionInstallation').show();
        }
        else{
            $('#inputPASCODEDiv').hide()
        }        
    }
    ResetPASCodeSearch(selComponent);
    if(selComponent == ANG_COMPONENT || selComponent == AFRC_COMPONENT){
        $('#sectionMajcom').hide();
    }
    else if(!$('#inputRadioPASCODEYes').is(":checked")){
        $('#sectionMajcom').show();
    }
    ResetPASCodeSearch(selComponent);
    getTooltips();
});

/* End  of organization details populate & change  functions*/
///////////////////////Accesibilty Tabs/////////////////////////////

$(document).ready(function () {
    var panel = new Tabpanel("myTab");
});

function Tabpanel(id) {
    this._id = id;
    this.$tpanel = $('#' + id);
    this.$tabs = this.$tpanel.find('.tab');
    this.$panels = this.$tpanel.find('.tab-pane');
    this.bindHandlers();
    this.init();
}

Tabpanel.prototype.keys = {
    left: 37,
    right: 39,
};

Tabpanel.prototype.init = function () {
    var $tab;

    this.$panels.attr('aria-hidden', 'true');
    this.$panels.removeClass('active in');
    $tab = this.$tabs.filter('.active');

    if ($tab === undefined) {
        $tab = this.$tabs.first();
        $tab.addClass('active');
    }

    this.$tpanel
        .find('#' + $tab.find('a').attr('aria-controls'))
        .addClass('active in').attr('aria-hidden', 'false');
}

Tabpanel.prototype.switchTabs = function ($curTab, $newTab) {
    var $curTabLink = $curTab.find('a'),
        $newTabLink = $newTab.find('a');

    var currentTab = $curTab.attr("id");
    if (currentTab == "profile-tab") {
        $("#form_successmsg").hide();
        closeValidations();
        $("#dodDuplicateErrMsg").hide();
    }
    if (currentTab == "mydocuments-tab") {
        $('.createfolder-popup,.documents-popup').hide();
    }
    $curTab.removeClass('active');
    $curTabLink.attr('tabindex', '-1').attr('aria-selected', 'false');

    $newTab.addClass('active');
    $newTabLink.attr('aria-selected', 'true');

    this.$tpanel
        .find('#' + $curTabLink.attr('aria-controls'))
        .removeClass('active in').attr('aria-hidden', 'true');

    this.$tpanel
        .find('#' + $newTabLink.attr('aria-controls'))
        .addClass('active in').attr('aria-hidden', 'false');

    $newTabLink.attr('tabindex', '0');
    $newTabLink.focus();
}

Tabpanel.prototype.bindHandlers = function () {
    var self = this;

    this.$tabs.keydown(function (e) {
        return self.handleTabKeyDown($(this), e);
    });

    this.$tabs.click(function (e) {
        return self.handleTabClick($(this), e);
    });
}

Tabpanel.prototype.handleTabKeyDown = function ($tab, e) {
    var $newTab, tabIndex;

    switch (e.keyCode) {
        case this.keys.left:
        case this.keys.up: {

            tabIndex = this.$tabs.index($tab);

            if (tabIndex === 0) {
                $newTab = this.$tabs.last();
            } else {
                $newTab = this.$tabs.eq(tabIndex - 1);
            }

            this.switchTabs($tab, $newTab);

            e.preventDefault();
            return false;
        }
        case this.keys.right:
        case this.keys.down: {

            tabIndex = this.$tabs.index($tab);

            if (tabIndex === this.$tabs.length - 1) {
                $newTab = this.$tabs.first();
            } else {
                $newTab = this.$tabs.eq(tabIndex + 1);
            }

            this.switchTabs($tab, $newTab);

            e.preventDefault();
            return false;
        }
    }
}

Tabpanel.prototype.handleTabClick = function ($tab, e) {
    var $oldTab = this.$tpanel.find('.tab.active');
    this.switchTabs($oldTab, $tab);
}
///////////////////////Accesibilty Tabs/////////////////////////////