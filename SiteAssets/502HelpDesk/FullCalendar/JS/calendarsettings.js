////////////////////////   CALENDAR COMPONENT SETTINGS JS  //////////////////////

//// Global Variables Declaration Starts Here ////

var scrollValue = 0;
var spURL = window.location.protocol + '//' + window.location.hostname + _spPageContextInfo.webServerRelativeUrl;
var pnpWeb = new $pnp.Web(spURL);
var WeeklyFrequencySet = new Map();
var monthFrequencySet = new Map();
var allEventsMap = new Map();
var allEventsData = [];
var eventsData = [];
var allcategories = [];
var allUserCPTS = [];
var categoryhtml = "";
var cspCatMultiQuery = "";
var CPTSMultiQuery = "";
var MajcomMultiQuery = "";
var serviceBaseCPTS = "";
var filterByCategoryVal = "";
var eventValidationErrorMsg = "";
var fullCalendar;
var calendarElement = document.getElementById("divcalendarcomponent");
var AssignedComponenthtml= '<select name="AssignedComponent" id="AssignedComponent-qlEdit"> <option value="" selected>Select</option><option value="ALL">ALL</option><option value="RegAF">Regular Air Force</option> <option value="AFRC">Air Force Reserve Command</option><option value="ANG">Air National Guard</option></select>';
var isFormValueChangesMade = false;
var calendarListName = "CSPCalendar";
var categorylist = "CategoriesMetadata";
var hourOptions = '<option value="00 AM">12 AM</option><option value="01 AM">1 AM</option><option value="02 AM">2 AM</option><option value="03 AM">3 AM</option><option value="04 AM">4 AM</option><option value="05 AM">5 AM</option><option value="06 AM">6 AM</option><option value="07 AM">7 AM</option><option value="08 AM">8 AM</option><option value="09 AM">9 AM</option><option value="10 AM">10 AM</option><option value="11 AM">11 AM</option><option value="12 PM">12 PM</option><option name = "" value = "13 PM" > 1 PM</option><option value="14 PM">2 PM</option><option value="15 PM">3 PM</option><option value="16 PM">4 PM</option><option value="17 PM">5 PM</option><option value="18 PM">6 PM</option><option value="19 PM">7 PM</option><option value="20 PM">8 PM</option><option value="21 PM">9 PM</option><option value="22 PM">10 PM</option><option value="23 PM">11 PM</option>';
var minuteOptions = '<option value="00">00</option><option value="05">05</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="25">25</option><option value="30">30</option><option value="35">35</option><option value="40">40</option><option value="45">45</option><option value="50">50</option><option value="55">55</option>';

//// Global Variables Declaration Ends Here /////

//// Indexed DB Initialization Starts Here /////

var IndexedDBName = _spPageContextInfo.webId + "{" + _spPageContextInfo.userId + "}";
var IndexedDBVersion = 1;
var IndexedDBPromise = $.Deferred();
var IndexedDBObjStores = [calendarListName];
var IndexedDB = new IndexedDBModule();
IndexedDB.initIndexedDb(IndexedDBName, IndexedDBVersion, IndexedDBObjStores, IndexedDBPromise);

//// Indexed DB Initialization Ends Here /////

///// Initial Executable Functions & Building Filter dropdown functions used in CSP //////

$(document).ready(function () {
	CSPDependentFunctions();
});

function CSPDependentFunctions() {
	$.when(processflows_d, userprofile_d).then(function () {
		bindCPTSDropdown();
	});

$.when(one, two, processflows_d).then(function () {
		//Registering click event for content management Calendar(li) element to call Calendar functionality. 
		$(".contentmanagement .Calendar").click(function () {
			$('#pageoverlay').removeClass('hidden');
			getCalendarPopupTemplate().then(function () {
				registerPopupDatePickers();
				registerPopupEvents();
				$("#weeklyDiv input[type='checkbox']").each(function (index, element) {
					WeeklyFrequencySet.set($(element).val(), index);
				});
				$("#monthlyByDay_weekOfMonth option").each(function (index, element) {
					monthFrequencySet.set($(element).val(), index + 1);
				});
				$("#AddEventStartHours, #AddEventEndHours, #EditEventStartHours, #EditEventEndHours").html(hourOptions);
				$("#EditEventStartMins, #EditEventEndMins, #AddEventStartMins, #AddEventEndMins").html(minuteOptions);
			});
			getCalendarEventsData().then(function () {
				displayCalendar();
				$("#pageoverlay").addClass("hidden");
			});
		});
	});

	function bindCPTSDropdown() {   
	if (isCPTSCatOwner || isCPTSOwner) {
		if((majcomForSettings==ANG_MAJCOM)){
			$("#ddlCalAssignedComponent").html("<option value='ANG'>Air National Guard </option>");
            $('#ddlServicingCPTS').html("<option value='"+cptsForSettings+"'> "+cptsForSettings +" </option>");
			}
		else if(majcomForSettings==AFRC_MAJCOM){
			$("#ddlCalAssignedComponent").html("<option value='AFRC'>Air Force Reserve Command </option>");
            $('#ddlServicingCPTS').html("<option value='"+cptsForSettings+"'> "+cptsForSettings +" </option>");
		}
		else{
			$("#ddlCalAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
            $('#ddlServicingCPTS').html("<option value='"+cptsForSettings+"'> "+cptsForSettings +" </option>");
		}
	} else if (isMAJCOMOwners) {
		if((majcomForSettings==ANG_MAJCOM)){
			$("#ddlCalAssignedComponent").html("<option value='ANG'>Air National Guard </option>");
            buildANGCPTF();
			}
		else if(majcomForSettings==AFRC_MAJCOM){
			$("#ddlCalAssignedComponent").html("<option value='AFRC'>Air Force Reserve Command </option>");
            buildAFRCFM();
		}
		else{
			$("#ddlCalAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
			$("#ddlServicingCPTS").html("");
            if (allcpts && allcpts.length > 0) {
				var thisMAJcpts = allcpts.filter(function (thiscpts) {
					return thiscpts.majcom == majcom;
				})
				if (thisMAJcpts.length > 1) {
					$("#ddlServicingCPTS").append('<option name="ALL" value ="ALL">ALL</option>');
				}
				$.each(thisMAJcpts, function (index, cptsItem) {
					$("#ddlServicingCPTS").append('<option name="' + cptsItem.cpts + '" value ="' + cptsItem.cpts + '">' + cptsItem.cpts + '</option>');
				});
			}
		}
	}
	else{
		if(isAFIMSCOwner){
			$("#ddlCalAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
		}else if(isAFFSCOwner){
			$("#ddlCalAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
			$("#ddlCalAssignedComponent").append("<option value='AFRC'>Air Force Reserve Command</option>");
		}
		else{
		$("#ddlCalAssignedComponent").html(ddlAssignedComponent);
		}
			//buildMajcom();
			buildCPTS();
		} 
	}
}
$(document).on("change","#ddlCalAssignedComponent",function(){
    selectedComponent = $("#ddlCalAssignedComponent").val();
    if(selectedComponent=="AFRC") {
        $("#ddlMajcom").html('<option value='+AFRC_MAJCOM+'>AFRC</option>');
        buildAFRCFM();
    } else if(selectedComponent=="ANG") {
        $("#ddlMajcom").html('<option value='+ANG_MAJCOM+'>NGB</option>');
        buildANGCPTF();
    }else{
        buildMajcom();
        buildCPTS();
    }
    serviceBaseCPTS = $("#ddlServicingCPTS").val();
	var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
		var activeDate = fullCalendar.getDate();
		getCalendarEventsData().then(function () {
			displayCalendar();
		});
		fullCalendar.gotoDate(activeDate);
		if (activeView != "fc-dayGridMonth-button") {
			$("." + activeView).trigger('click');
		}
});

/////////

function getCalendarPopupTemplate() { ///// Loads Calendar Popup Template /////
	return new Promise(function (resolve, reject) {
		var calendarPopupHTML = localStorage.getItem("calendarpopups-" + sitename);
		if (calendarPopupHTML) {
			$("#backgr").html(calendarPopupHTML);
			resolve();
		} else {
			jQuery.ajax({
				url: '../SiteAssets/FullCalendar/Templates/calendarpopups.html',
				async: true,
				success: function (template) {
					calendarPopupHTML = template;
					$("#backgr").html(calendarPopupHTML);
					localStorage.setItem("calendarpopups-" + sitename, calendarPopupHTML);
					resolve();
				}
			});
		}
	});
}

function getCalendarEventsData() { //// Gets Events Data for Calendar from List/Indexed DB /////
	return new Promise(function (resolve, reject) {
		var lastmodifieddate = localStorage.getItem("CSPCalendarLastModifiedListDate_" + sitename);
		var oldmodifieddate = localStorage.getItem("CSPCalendar_LMDate_" + sitename);
		if (!lastmodifieddate || !oldmodifieddate || lastmodifieddate != oldmodifieddate) {
			pnpWeb.lists.getByTitle(calendarListName).items.select("*,ParticipantsPicker/ID,ParticipantsPicker/Title,Author/ID,Author/Title,Title,Description,EventDate,EndDate,Duration,RecurrenceData,AttachmentFiles,Is_x0020__x0020_Archive,CPTS,MAJCOM,Role,FY,CSPCategory/ID,CSPCategory/Title,AssignedComponent").expand("Author,ParticipantsPicker,AttachmentFiles,CSPCategory").top(5000).orderBy("Modified", false).get().then(function (data) {
				$.each(data, function (i, v) {
					var cspCategory = "";
					if (v.CSPCategory.length > 0) {
						$.each(v.CSPCategory, function (i, v) {
							cspCategory += v.Title + ", ";
						});
						cspCategory = cspCategory.slice(0, -2);
					}
					data[i].CPTS = v.CPTS,
					data[i].CSPCategory = cspCategory;
					allEventsMap.set(v.ID, v);
				});
				// Storing Events in IndexedDB when IndexedDB initialized //		
				IndexedDBPromise.then(function () {
					IndexedDB.storeDataInIndexedDb(data, calendarListName).then(function () {
						localStorage.setItem("CSPCalendar_LMDate_" + sitename, lastmodifieddate);
					});
				});
				///////////////		
				allEventsData = filterUserData(data);
				resolve(allEventsData);
			}).catch(function (error) {
				reject(error);
			});
		} else {
			// Retrieving Events from IndexedDB when IndexedDB initialized //
			IndexedDBPromise.then(function () {
				IndexedDB.getIndexedDBData(calendarListName).then(function (data) {
					allEventsData = filterUserData(data);
					$.each(allEventsData, function (i, v) {
						allEventsMap.set(v.ID, v);
					});
					resolve(allEventsData);
				}, function () {
					localStorage.setItem("CSPCalendar_LMDate_" + sitename, null);
					getCalendarEventsData().then(function () {
						displayCalendar();
						$("#pageoverlay").addClass("hidden");
					});
				});
			}, function () {
				localStorage.setItem("CSPCalendar_LMDate_" + sitename, null);
				getCalendarEventsData().then(function () {
					displayCalendar();
					$("#pageoverlay").addClass("hidden");
				});
			});
			///////////////		
		}
	});
	
}

function filterUserData(data) { 
	//// Filters Events Data for Loggedin User /////
	var cptsServiceBase = JSON.parse(localStorage.getItem('CPTSServiceBase_' + sitename));
	var angServiceBase = JSON.parse(localStorage.getItem('ANGServiceBase_' + sitename));
	var afrcServiceBase = JSON.parse(localStorage.getItem('AFRCServiceBase_' + sitename));
	selectedComponent=$("#ddlCalAssignedComponent").val();
	serviceBaseCPTS=$("#ddlServicingCPTS").val();
	if(serviceBaseCPTS!= null && serviceBaseCPTS != undefined){
        serviceBaseCPTS=serviceBaseCPTS.replace(/\//g, " ");}
	if (isCPTSOwner) {
		data=alasql("SELECT * FROM ? where (AssignedComponent LIKE COALESCE('%" + AssignedComponentforSettings +"%',AssignedComponent) OR AssignedComponent = COALESCE('ALL',AssignedComponent) OR AssignedComponent = COALESCE('All',AssignedComponent))AND(CPTS LIKE COALESCE('%" + cptsForSettings + "%',CPTS) OR CPTS = COALESCE('ALL',CPTS) OR CPTS = COALESCE('All',CPTS)) AND (Role LIKE COALESCE('CPTSOwner',Role) OR Role LIKE COALESCE('CPTSCatOwner',Role) OR Role LIKE COALESCE('',Role))",[data]);
	} else if (isCPTSCatOwner) {
		data = alasql("SELECT * FROM ? where (AssignedComponent LIKE COALESCE('%" + AssignedComponentforSettings +"%',AssignedComponent) OR AssignedComponent = COALESCE('ALL',AssignedComponent) OR AssignedComponent = COALESCE('All',AssignedComponent))AND (CPTS LIKE COALESCE('%" + cptsForSettings + "%',CPTS) OR CPTS = COALESCE('ALL',CPTS) OR CPTS = COALESCE('All',CPTS)) AND (Role LIKE COALESCE('CPTSCatOwner',Role) OR Role LIKE COALESCE('',Role)) AND (CSPCategory LIKE COALESCE('%"+categoryForSettings+"%', CSPCategory))", [data]);
	} else if (isMAJCOMOwners) {
		data = alasql("SELECT * FROM ? where (AssignedComponent LIKE COALESCE('%" + AssignedComponentforSettings +"%',AssignedComponent) OR AssignedComponent = COALESCE('ALL',AssignedComponent)  OR AssignedComponent = COALESCE('All',AssignedComponent))AND (MAJCOM LIKE COALESCE('%" + majcom + "%',Majcom) OR MAJCOM LIKE COALESCE('ALL',Majcom) OR MAJCOM LIKE COALESCE('All',Majcom)) AND (Role LIKE COALESCE('MAJCOMOwners',Role) OR Role LIKE COALESCE('CPTSOwner',Role) OR Role LIKE COALESCE('CPTSCatOwner',Role) OR Role LIKE COALESCE('',Role))", [data]);
	} else if (isAFFSCOwner) {
		data = alasql("SELECT * FROM ? where CSPCategory LIKE COALESCE('%Travel Pay%',CSPCategory)  AND (Role LIKE COALESCE('AFFSCOwner',Role) OR Role LIKE COALESCE('CPTSCatOwner',Role) OR Role LIKE COALESCE('',Role))", [data]);
	} else if (isSAFFMBOwner) {
		data = alasql("SELECT * FROM ? where CSPCategory LIKE COALESCE('%Budget%',CSPCategory)  AND (Role LIKE COALESCE('SAFFMBOwner',Role) OR Role LIKE COALESCE('CPTSCatOwner',Role) OR Role LIKE COALESCE('',Role))", [data]);
	}
	else{
		var servicebase = (selectedComponent== "AFRC" ? afrcServiceBase : selectedComponent == "ANG" ? angServiceBase : cptsServiceBase );
		var selectedmajcom = alasql("SELECT majcom FROM ? where cpts == COALESCE('" + serviceBaseCPTS + "',cpts)",[servicebase]);
		var component = "(AssignedComponent LIKE COALESCE('%" + selectedComponent + "%',AssignedComponent) OR AssignedComponent LIKE COALESCE('%ALL%',AssignedComponent))";
        var cpts = (serviceBaseCPTS == "ALL" || serviceBaseCPTS == null || serviceBaseCPTS == undefined ? CPTSMultiQuery  : "(CPTS == COALESCE('" + serviceBaseCPTS + "',CPTS) OR CPTS LIKE COALESCE('%ALL%',CPTS))");
		var majcomcpts = (serviceBaseCPTS == "ALL" || serviceBaseCPTS == null || serviceBaseCPTS == undefined ? "" : "(MAJCOM == COALESCE('" + selectedmajcom[0].majcom + "',MAJCOM) OR (MAJCOM LIKE COALESCE('%ALL%',MAJCOM)))");   
		//"(CPTS == COALESCE('" + serviceBaseCPTS + "',CPTS) OR ((CPTS == COALESCE('ALL',CPTS) OR CPTS == COALESCE('All',CPTS) && (MAJCOM == COALESCE('ALL',MAJCOM) OR MAJCOM == COALESCE('All',MAJCOM) OR MAJCOM LIKE COALESCE('%" + selectedmajcom[0].majcom + "%',Majcom))))");
		// "(CPTS == COALESCE('" + serviceBaseCPTS + "',CPTS) OR ((CPTS == COALESCE('ALL',CPTS) OR CPTS == COALESCE('All',CPTS)) && (MAJCOM == COALESCE('ALL',MAJCOM) OR MAJCOM == COALESCE('All',MAJCOM) OR MAJCOM LIKE COALESCE('%" + selectedmajcom[0].majcom + "%',Majcom)))");
        if(serviceBaseCPTS == "ALL" || serviceBaseCPTS == null || serviceBaseCPTS == undefined){
		query = ("SELECT * FROM ? where ("+ component +") AND ("+ cpts +")");}
		else{
		query = ("SELECT * FROM ? where ("+ component +") AND ("+ cpts +") AND ("+ majcomcpts +")");}
		var data = alasql(query, [data]);
	}
	return data;
}

function displayCalendar() { //// Main function to display Calendar in required grid views /////
	$(calendarElement).html('');
	fullCalendar = new FullCalendar.Calendar(calendarElement, {
		plugins: ['dayGrid', 'timeGrid'],
		defaultView: 'dayGridMonth',
		fixedWeekCount: false,
		header: {
			left: 'prev,next',
			center: 'title',
			right: 'timeGridDay,timeGridWeek,dayGridMonth'
		},
		views: {
			dayGrid: {
				// options apply to dayGridMonth, dayGridWeek, and dayGridDay views
				eventLimit: true // adjust to 6 only for timeGridWeek/timeGridDay
			},
			timeGrid: {
				// options apply to timeGridWeek and timeGridDay views
				eventLimit: true // adjust to 6 only for timeGridWeek/timeGridDay
			},
			week: {
				// options apply to dayGridWeek and timeGridWeek views
			},
			day: {
				// options apply to dayGridDay and timeGridDay views
			},
		},
		eventTimeFormat: {
			hour: '2-digit',
			minute: '2-digit',
			meridiem: true
		},
		events: function (info, successCallback, failureCallback) {
			var startDate = new Date(info.startStr);
			var endDate = new Date(info.endStr);
			parseEventsForCalendar(allEventsData, startDate, endDate);
			successCallback(
				eventsData.map(function (eventEl) {
					return {
						title: eventEl.Title,
						allDay: (eventEl.EventDate.getDate() == eventEl.EndDate.getDate()) ? eventEl.fAllDayEvent : false,
						start: eventEl.EventDate,
						end: eventEl.EndDate,
						backgroundColor: "#D4DEF4",
						fullEvent: eventEl
					}
				})
			);
		},
		eventClick: function (info) {
			showPopup(info.event.extendedProps.fullEvent.uniqueID);
		},
		eventRender: function (info) {
			var evntLocation = (info.event.extendedProps.fullEvent.Location) ? ' ' + '(' + info.event.extendedProps.fullEvent.Location + ')' : '';
			$(info.el).closest('.fc-event').attr('eventId', info.event.extendedProps.fullEvent.ID);
			$(info.el).closest('.fc-event').attr('title', info.el.text + evntLocation);
			$(info.el).closest('.fc-event').attr("CPTS", info.event.extendedProps.fullEvent.CPTS);
			$(info.el).closest('.fc-event').attr('href', "javascript:void(0);");
			/*if (serviceBaseCPTS && serviceBaseCPTS != "ALL") {
				if (info.event.extendedProps.fullEvent.CPTS != serviceBaseCPTS && (info.event.extendedProps.fullEvent.CPTS != 'All'|| info.event.extendedProps.fullEvent.CPTS != 'ALL' )) {
					info.event.remove();
				}
			}*/
			setPluginAttributes();
		},
		dayRender: function (info) {
			if (info.date >= new Date().setHours(0, 0, 0, 0)) {
				$element = $(info.el).closest(".fc-bg").siblings(".fc-content-skeleton").find(`[data-date='${$(info.el).data('date')}']`);
				$element.prepend("<a href='javascript:void(0);' class='addEventLabel'>+ Add Event</a>");
				$element.find('.addEventLabel').on("click", function () {
					showAddPopup(info.date);
				});
			}
			setPluginAttributes();
		}, 
	});
	fullCalendar.render();
} 


function parseEventsForCalendar(allEventsData, startDate, endDate) { //// Parse Events function used to parse allEventsData from selected start to end, inclucing recurring events ////
	var tempEvents = [];
	eventsData = [];
	tempEvents = spEventsParser.parseEvents(allEventsData, startDate, endDate);
	$.each(tempEvents, function (index, tempEvent) {
		var masterEvent = allEventsMap.get(tempEvent.ID);
		var masterEventStart = (masterEvent.EventDate instanceof Date ? masterEvent.EventDate : (masterEvent.fAllDayEvent ? formDateObjectWithouTZ(masterEvent.EventDate) : new Date(masterEvent.EventDate)));
		var masterEventEnd = (masterEvent.EndDate instanceof Date ? masterEvent.EndDate : (masterEvent.fAllDayEvent ? formDateObjectWithouTZ(masterEvent.EndDate) : new Date(masterEvent.EndDate)));
		//Whlie parsing events using spEventsParser for some events the end hours is automatically being increased by 1.
		//Hence if any event effected such way will be reverted back to its original time in the below line of code.
		tempEvent.EndDate = (tempEvent.EndDate.getHours() - 1 == masterEventEnd.getHours() ? new Date(tempEvent.EndDate.setHours(tempEvent.EndDate.getHours() - 1)) : tempEvent.EndDate.getHours() + 23 == masterEventEnd.getHours() ? new Date(tempEvent.EndDate.setHours(tempEvent.EndDate.getHours() - 1)) : tempEvent.EndDate);
		if (masterEvent && tempEvent.EventDate >= masterEventStart && tempEvent.EndDate <= masterEventEnd) {
			tempEvent.uniqueID = 999 + index; //Just a random unique ID
			eventsData.push(tempEvent);
		}
	});
}

function showAddPopup(Date) { //// To Show Add Popup when clicked on add event from grids ////
	resetAddEventValues();
	$(".backgr").show();
	$("#AddCalendarEventPopup").show();
	//makeElementDraggable("#AddCalendarEventPopup");
	var addDate = ((Date.getMonth() + 1) > 9 ? (Date.getMonth() + 1) : "0" + (Date.getMonth() + 1)) + "/" + (Date.getDate() > 9 ? Date.getDate() : "0" + Date.getDate()) + "/" + Date.getFullYear();
	$("#AddEventStartDate, #AddEventEndDate, #windowStart_windowStartDate").val(addDate);
}

function showPopup(uniqueId) { //// To Show Add Popup for existing event from grids ////
	resetEditEventValues();
	enablePopupSwitches(uniqueId);
	var calEvent = eventsData.filter(function (thisEvent) {
		return thisEvent.uniqueID == uniqueId;
	})[0];
	$(".backgr").show();
	var descText = calEvent.Description;
	var descText = jQuery('<div>').html(descText).text();
	$("#EditCalendarEventPopup").show();
	//makeElementDraggable("#EditCalendarEventPopup");
	$("#EditCalendarEventPopup").attr("uniqueId", uniqueId);
	$("#EditCalendarEventPopup").attr("eventId", calEvent.ID);
	$("#EditEventTitle").val(filterNullOrUndefined(calEvent.Title));
	$("#EditEventLocation").val(filterNullOrUndefined(calEvent.Location));
	$("#EditEventStartDate").val(getEventDate(calEvent.EventDate, calEvent.fAllDayEvent));
	$("#EditEventStartHours").val(getEventHours(calEvent.EventDate));
	$("#EditEventStartMins").val(getEventMins(calEvent.EventDate));
	$("#EditEventEndDate").val(getEventDate(calEvent.EndDate, calEvent.fAllDayEvent));
	$("#EditEventEndHours").val(getEventHours(calEvent.EndDate));
	$("#EditEventEndMins").val(getEventMins(calEvent.EndDate));
	$("#EditEventDescription").val(descText);
 
	if (calEvent.fAllDayEvent) {
		$("#EditAlldayEvent").prop("checked", true);
		$("#EditEventStartHours").val("00 AM");
		$("#EditEventEndHours").val("00 AM");
		$("#EditEventStartMins").val("00");
		$("#EditEventEndMins").val("00");
		$("#EditEventStartHours, #EditEventStartMins, #EditEventEndHours, #EditEventEndMins").removeClass('hide-element');
	}

	if (allEventsMap.get(calEvent.ID).fRecurrence) {
		$("#EditRecurrenceEvent").prop("checked", true);
		$("#EditRecurrenceView span").html(decodeRecurringXML(allEventsMap.get(calEvent.ID)));
	} else {
		$("#EditRecurrenceView span").html("No");
	}

	var cspCategory = calEvent.CSPCategory.split(", ");
	var categorytext = "";
	var categoryid = [];
	$(allcategories).each(function (i, n) {
		$(cspCategory).each(function (j, v) {
			if (v == n.Categories) {
				categorytext += n.Categories + ", ";
				categoryid.push(n.ID);
			}
		});
		$("#EditCalendarEventPopup .fs-label").html(categorytext.length > 0 ? categorytext.replace(/,\s*$/, "") : "Select Categories");
	});
	$(categoryid).each(function (i, n) {
		$("#EditCalendarEventPopup .fs-option").each(function () {
			if ($(this).attr("data-value") == n) {
				$(this).addClass("selected");
			}
		});
	});
	AssignedComptext=calEvent.AssignedComponent;
	$('#EditAssignedComponent option[value="'+ AssignedComptext +'"]').prop("selected", true);
	
	if (calEvent.Category == "Meeting" || calEvent.Category == "Work Hours" || calEvent.Category == "Business" || calEvent.Category == "Holiday" || calEvent.Category == "Get Together") {
		$("#EditCategorySelectedValue").val(calEvent.Category);
		$("#EditCategorySelecetdChoice").prop("checked", true);
	} else if (calEvent.Category) {
		$("#EditCategoryUsersValue").val(calEvent.Category);
		$("#EditCategoryUserChoice").prop("checked", true);
	}

	if (calEvent.Is_x0020__x0020_Archive) {
		$("#EditIsArchiveEvent").prop("checked", true);
	}

	if (calEvent.AttachmentFiles && calEvent.AttachmentFiles.length > 0) {
		var attachHtmlEdit = "<ul>";
		var attachHtml = "<ul>"
		calEvent.AttachmentFiles.forEach(function (File) {
			attachHtml += "<li><a href='" + File.ServerRelativeUrl + "' target='_blank' title='" + File.FileName + "'> " + File.FileName + "</a></li>";
			attachHtmlEdit += '<li><a href="#" title="' + File.FileName + '" class="attchfile mt2">' + File.FileName + ' <i class="icon-calendarclose" onclick="removeEditAttachment(this,\'' + File.FileName + '\');" onkeypress="removeEditAttachment(this,\'' + File.FileName + '\');" title="Close"></i></a></li>';
		})
		$("#EventAttachmentsView").html(attachHtml + "</ul>");
		$("#eventAttachementsEdit").html(attachHtmlEdit + "</ul>");
	} else {
		$("#EventAttachmentsView").html("<span>No</span");
	}
}

function enablePopupSwitches(uniqueId) { //// Enables Buttons for Popup to switch b/w events within popup view ////
	$("#PreviousEvent, #NextEvent").hide();
	$("#PreviousEvent").attr("PrevEventId", "");
	$("#NextEvent").attr("NextEventId", "");
	var parsedNext = false;

	var currEvent = eventsData.filter(function (thisEvent) {
		return thisEvent.uniqueID == uniqueId;
	})[0];

	var allThisDayEvents = eventsData.filter(function (thisEvent) {
		return thisEvent.EventDate.toLocaleDateString() == currEvent.EventDate.toLocaleDateString();
	}).sort(function (a, b) {
		return new Date(a.EventDate) - new Date(b.EventDate);
	});

	$.each(allThisDayEvents, function (index, item) {
		if (item.EventDate.getTime() < currEvent.EventDate.getTime()) {
			$("#PreviousEvent").show().attr("PrevEventId", item.uniqueID);
		} else if (item.EventDate.getTime() == currEvent.EventDate.getTime() && item.uniqueID != currEvent.uniqueID && item.Modified > currEvent.Modified) {
			$("#PreviousEvent").show().attr("PrevEventId", item.uniqueID);
		} else if (item.EventDate.getTime() == currEvent.EventDate.getTime() && !parsedNext && item.uniqueID != currEvent.uniqueID && item.Modified < currEvent.Modified) {
			$("#NextEvent").show().attr("NextEventId", item.uniqueID);
			parsedNext = true;
		} else if (item.EventDate.getTime() > currEvent.EventDate.getTime() && !parsedNext) {
			$("#NextEvent").show().attr("NextEventId", item.uniqueID);
			parsedNext = true;
		}
	});
}

function registerPopupDatePickers() { //// Registers Date Pickers for ADD/EDIT Popup ////
	//For Add events Date pickers
	$("#AddEventStartDate, #AddEventStartDateIcon").datepicker({
		minDate: 0,
		onSelect: function (selected) {
			$("#AddEventEndDate").datepicker("option", "minDate", selected);
			$("#AddEventEndDateIcon").datepicker("option", "minDate", selected);
			$("#AddEventStartDate").trigger("change");
		},
	});
	$("#AddEventStartDateIcon").click(function () {
		$("#AddEventStartDate").focus();
	});
	$("#AddEventEndDateIcon").click(function () {
		$("#AddEventEndDate").focus();
	});

	$("#windowStart_windowStartDate, #windowStart_windowStartDateIcon").datepicker({
		minDate: 0,
		onSelect: function (selected) {
			$("#windowEnd_windowEndDate").datepicker("option", "minDate", selected);
			$("#windowEnd_windowEndDateIcon").datepicker("option", "minDate", selected);
			$("#windowEnd_windowEndDate").trigger("change");
		}
	});
	$("#windowStart_windowStartDateIcon").click(function () {
		$("#windowStart_windowStartDate").focus();
	});
	$("#windowEnd_windowEndDateIcon").click(function () {
		$("#windowEnd_windowEndDate").focus();
	});

	$("#AddEventEndDate, #AddEventEndDateIcon, #windowEnd_windowEndDate, #windowEnd_windowEndDateIcon").datepicker({
		minDate: 0,
	});
	//****//

	//For Edit events Date pickers
	$("#EditEventStartDate, #EventStartDateIcon").datepicker({
		minDate: 0,
		onSelect: function (selected) {
			$("#EditEventEndDate").datepicker("option", "minDate", selected);
			$("#EditEventEndDateIcon").datepicker("option", "minDate", selected);
			$("#EditEventStartDate").trigger("change");
		}
	});
	$("#EditEventStartDateIcon").click(function () {
		$("#EditEventStartDate").focus();
	});
	$("#EditEventEndDateIcon").click(function () {
		$("#EditEventEndDate").focus();
	});

	$("#EditwindowStart_windowStartDate, #EditwindowStart_windowStartDateIcon").datepicker({
		minDate: 0,
		onSelect: function (selected) {
			$("#EditwindowEnd_windowEndDate").datepicker("option", "minDate", selected);
			$("#EditwindowEnd_windowEndDateIcon").datepicker("option", "minDate", selected);
			$("#EditwindowStart_windowStartDate").trigger("change");
		}
	});
	$("#EditwindowStart_windowStartDateIcon").click(function () {
		$("#EditwindowStart_windowStartDate").focus();
	});
	$("#EditwindowEnd_windowEndDateIcon").click(function () {
		$("#EditwindowEnd_windowEndDate").focus();
	});

	$("#EditEventEndDate, #EditEventEndDateIcon, #EditwindowEnd_windowEndDate,  #EditwindowEnd_windowEndDateIcon").datepicker({
		minDate: 0,
	});
}

function registerPopupEvents() { //// Registers Events for ADD/EDIT Popup actions ////

	$("#AddCalendarEvent").click(function () {
		resetAddEventValues();
		$(".backgr").show();
		$("#AddCalendarEventPopup").show();
		$("#AddEventTitle").focus();
		//makeElementDraggable("#AddCalendarEventPopup");
	});

	$("#AddCalendarEventPopup .cancelEventBtn, .closeEventPopup").click(function () {
		$(".backgr").hide();
		$(this).closest(".eventPopup").hide();
	});

	//$(".eventPopup input, .eventPopup select, .eventPopup textarea").change(function () {
	//	isFormValueChangesMade = true;
	//});

	$("#EditCalendarEventPopup .cancelEventBtn").click(function () {
		if (isFormValueChangesMade) {
			if (confirm("Changes you made will not be saved, Are you sure you want to continue?")) {
				showPopup($(this).closest(".eventPopup").attr('uniqueId'));
			}
		} else {
			showPopup($(this).closest(".eventPopup").attr('uniqueId'));
		}
	});

	$("#AddCategorySelectedValue").change(function () {
		$("#AddCategorySelecetdChoice").prop("checked", true);
		$("#AddCategoryUserChoice").prop("checked", false);
		$("#AddCategoryUsersValue").val("");
		$("#AddCategoryUsersValue").prop("disabled", true);
		$(this).closest(".evtCategoryDiv").find(".errormsg").addClass("hidden");
	});

	$("#AddCategorySelecetdChoice").change(function () {
		$("#AddCategoryUserChoice").prop("checked", false);
		$("#AddCategoryUsersValue").val("");
		$("#AddCategoryUsersValue").prop("disabled", true);
	});

	$("#AddCategoryUserChoice").change(function () {
		$("#AddCategorySelecetdChoice").prop("checked", false);
		$("#AddCategorySelectedValue").val("");
		$("#AddCategoryUsersValue").prop("disabled", false);
	});

	$("#AddAlldayEvent, #EditAlldayEvent").change(function () {
		if ($(this).is(":checked")) {
			$(this).closest(".eventPopup").find(".add-time-input select, .add-min-input select").prop("disabled", true);
			$(this).closest(".eventPopup").find(".add-time-input select, .add-min-input select").prop("selectedIndex", 0);
		} else {
			$(this).closest(".eventPopup").find(".add-time-input select, .add-min-input select").prop("disabled", false);
		}
	});

	$("#AddRecurrenceEvent").change(function () {
		if ($(this).is(":checked")) {
			$("#AddEventStartDate,#AddEventStartDateIcon,#AddEventEndDate,#AddEventEndDateIcon").hide();
			$('#AddCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px');
			$('#AddCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '0px');
			$(".recurrence-event").find("input[type='number']").val('');
			$(".recurrence-event").find("input[type='radio'], input[type='checkbox']").prop('checked', false);
			$(".recurrence-event").find("select").prop('selectedIndex', 0);
			$("#windowStart_windowStartDate,#windowEnd_windowEndDate").val("");
			$("#AddCalendarEventPopup").find('.date-time-forms').siblings(".errormsg").addClass("hidden").html("");
			$('fieldset').siblings(".errormsg").addClass("hidden").html("");
			$("#Daily").trigger("click");
			$(".recurrence-event").show();
		} else {
			$("#AddEventStartDate,#AddEventEndDate").val("");
			$("#AddEventStartDate,#AddEventStartDateIcon,#AddEventEndDate,#AddEventEndDateIcon").show();
			$('#AddCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px 10px -5px 0px');
			$('#AddCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '10px');
			$(".recurrence-event").hide();
		}
	});

	$("#EndafterInstances").change(function () {
		$("#Endafter").prop("checked", true);
	});

	$("#windowEnd_windowEndDate").change(function () {
		$("#Endby").prop("checked", true);
	});

	$("#EditCategorySelectedValue").change(function () {
		$("#EditCategorySelecetdChoice").prop("checked", true);
		$("#EditCategoryUserChoice").prop("checked", false);
		$("#EditCategoryUsersValue").val("");
		$("#EditCategoryUsersValue").prop("disabled", true);
		$(this).closest(".evtCategoryDiv").find(".errormsg").addClass("hidden");
	});

	$("#EditCategorySelecetdChoice").change(function () {
		$("#EditCategoryUserChoice").prop("checked", false);
		$("#EditCategoryUsersValue").val("");
		$("#EditCategoryUsersValue").prop("disabled", true);
	});

	$("#EditCategoryUserChoice").change(function () {
		$("#EditCategorySelecetdChoice").prop("checked", false);
		$("#EditCategorySelectedValue").val("");
		$("#EditCategoryUsersValue").prop("disabled", false);
	});

	$("#editEvent").click(function () {
		$("#editEvent").hide();
		$(".editEventVal, .editEventProp").prop("disabled", false);
		$(".editEventVal, .editEventProp").removeClass("hide-element");
		$("#EditCalendarEventPopup .category-select").removeClass("disabled");
		$("#EditCalendarEventPopup .AssignedComponent").removeClass("disabled");
		$('#EditEventStartDateIcon, #EditEventEndDateIcon').attr("title", "Select Date");
		$('#EditEventStartDateIcon, #EditEventEndDateIcon').css("cursor", "pointer");
		var eventId = $("#EditCalendarEventPopup").attr("eventid");
		var editItem = allEventsMap.get(JSON.parse(eventId));
		if (editItem && editItem.fAllDayEvent) {
			$("#EditEventStartHours,#EditEventStartMins,#EditEventEndHours,#EditEventEndMins").prop("disabled", true);
		}
		if (editItem && editItem.fRecurrence) {
			prePopRecurrenceValues(editItem);
		}
		if (!editItem.Category || (editItem.Category == "Meeting" || editItem.Category == "Work Hours" || editItem.Category == "Business" || editItem.Category == "Holiday" || editItem.Category == "Get Together")) {
			$("#EditCategoryUsersValue").prop("disabled", true);
		}
		var AssignedComptext = editItem.AssignedComponent;
		$('#EditAssignedComponent option[value="'+ AssignedComptext +'"]').prop("selected", true);
		$("#EventAttachmentsView, #EditRecurrenceView").addClass('hidden');
		$("#eventAttachementsEditDiv, #EditRecurrenceEdit").removeClass('hidden');
		$("#UpdateEvent, #EditCalendarEventPopup .cancelEventBtn").show();
		$("#DeleteEvent, .prev-next-btns").hide();
	});

	$("#EditRecurrenceEvent").change(function () {
		if ($(this).is(":checked")) {
			$("#EditEventStartDate,#EditEventStartDateIcon,#EditEventEndDate,#EditEventEndDateIcon").hide();
			$('#EditCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px');
			$('#EditCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '0px');
			$(".recurrence-event").find("input[type='number']").val('');
			$(".recurrence-event").find("input[type='radio'], input[type='checkbox']").prop('checked', false);
			$(".recurrence-event").find("select").prop('selectedIndex', 0);
			$("#EditwindowStart_windowStartDate,#EditwindowEnd_windowEndDate").val("");
			$("#EditCalendarEventPopup").find('.date-time-forms').siblings(".errormsg").addClass("hidden").html("");
			$('fieldset').siblings(".errormsg").addClass("hidden").html("");
			$("#EditDaily").trigger("click");
			$(".recurrence-event").show();
		} else {
			$("#EditEventStartDate,#EditEventEndDate").val("");
			$("#EditEventStartDate,#EditEventStartDateIcon,#EditEventEndDate,#EditEventEndDateIcon").show();
			$('#EditCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px 10px -5px 0px');
			$('#EditCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '10px');
			$(".recurrence-event").hide();
		}
	});

	$("#EditEndafterInstances").change(function () {
		$("#EditEndafter").prop("checked", true);
	});

	$("#EditwindowEnd_windowEndDate").change(function () {
		$("#EditEndby").prop("checked", true);
	});

	$("#PreviousEvent").click(function () {
		showPopup($(this).attr('PrevEventId'));
	});

	$("#NextEvent").click(function () {
		showPopup($(this).attr('NextEventId'));
	});

	$("#ddlServicingCPTS").change(function () {
		serviceBaseCPTS = $("#ddlServicingCPTS").val();
		var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
		var activeDate = fullCalendar.getDate();
		getCalendarEventsData().then(function () {
			displayCalendar();
		});
		fullCalendar.gotoDate(activeDate);
		if (activeView != "fc-dayGridMonth-button") {
			$("." + activeView).trigger('click');
		}
		
	});

	$("div.recurrence-info").each(function () {
		if ($(this).attr("id") != "dailyDiv" && $(this).attr("id") != "EditdailyDiv") {
			$(this).hide();
		}
	});

	$("input[name$='recurrence-list']").click(function () {
		var test = $(this).val();
		$("div.recurrence-info").hide();
		$("." + test + "Div").show();
		$(".recurrence-info").find("input[type='number']").val('');
		$(".recurrence-info").find("input[type='radio'], input[type='checkbox']").prop('checked', false);
		$(".recurrence-info").find("select").prop('selectedIndex', 0);
	});

	$("input[name='dailyRecurType'], input[name='monthlyRecurType']").change(function () {
		$(this).closest(".every-radio-btn").siblings(".every-radio-btn").find("input[type='number']").val('');
		$(this).closest(".every-radio-btn").siblings(".every-radio-btn").find("select").prop('selectedIndex', 0);
	});

	$("input[name='EndDateRangeType'], #EndafterInstances, #EditEndafterInstances, #EditwindowEnd_windowEndDate, #windowEnd_windowEndDate").change(function () {
		$(this).closest(".every-radio-btn").siblings(".every-radio-btn").find("input[type='number']").val('');
		$(this).closest(".every-radio-btn").siblings(".every-radio-btn").find("input[type='text']").val('');
	});

	$("input[name='dailyRecurFrequency']").change(function () {
		$(this).closest(".every-radio-btn").find("input[name='dailyRecurType']").trigger("click");
	});

	$("input[name='monthlyDayOf'], input[name='monthFrequency'], select[name='monthlyByDay_weekOfMonth'], select[name='monthlyByDay_day'], input[name='monthlyByDay_monthFrequency']").change(function () {
		$(this).closest(".every-radio-btn").find("input[name='monthlyRecurType']").trigger("click");
	});

	$("select[name='yearly_month'], input[name='yearly_day'], select[name='yearlyByDay_weekOfMonth'], select[name='yearlyByDay_day'], select[name='yearlyByDay_month']").change(function () {
		$(this).closest(".every-radio-btn").find("input[name='yearlyRecurType']").trigger("click");
	});

	$(".date-time-forms .hasDatepicker").change(function () {
		var selectedDate = $(this).val();
		var selectedDateObj = new Date(selectedDate);
		if (selectedDate && !validateInputDateFormats(selectedDate)) {
			eventValidationErrorMsg = "Invalid start date.";
			$(this).closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		} else if (selectedDateObj instanceof Date && selectedDateObj < new Date().setHours(0, 0, 0, 0)) {
			eventValidationErrorMsg = "Event cannot be created in the past.";
			$(this).closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		} else {
			$(this).closest('.date-time-forms').siblings(".errormsg").addClass("hidden").html("");
		}
	});

	$(".range-info .hasDatepicker").change(function () {
		var selectedDate = $(this).val();
		var selectedDateObj = new Date(selectedDate);
		if (selectedDate && !validateInputDateFormats(selectedDate)) {
			eventValidationErrorMsg = "Invalid date.";
			$(this).closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		} else if (selectedDateObj instanceof Date && selectedDateObj < new Date().setHours(0, 0, 0, 0)) {
			eventValidationErrorMsg = "Event cannot be created in the past.";
			$(this).closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		} else {
			$(this).closest('fieldset').siblings(".errormsg").addClass("hidden").html("");
		}
	});
}

///// ADD EVENT FUNCTIONALITY STARTS HERE /////

var allowAddRequest = true; // To avoid multiple save clicks adding duplicate events

function addEvent() {
	var addEventData, addEventFiles;
	var EventDate, EndDate;
	var Category, CPTS, MAJCOM, FY, AssignedComponent = "";

	if (isCPTSCatOwner || isCPTSOwner) {
		CPTS = cptsForSettings;
		MAJCOM = majcomForSettings;
	} else if (isMAJCOMOwners) {
		CPTS = "ALL";
		MAJCOM = majcomForSettings;
	} else {
		CPTS = "ALL";
		MAJCOM = "ALL";
	}
	AssignedComponent = $('#AddAssignedComponent').val();
	FY = getFiscalYear(new Date());
	var CSPCategoryId = {
		results: $("#AddCspCategory").val(),
	}

	var Role = (isSiteAdmin || isCSPOwner ? "CSPOwner" : isMAJCOMOwners ? "MAJCOMOwners" : isAFFSCOwner ? "AFFSCOwner" : isSAFFMFOwner ? "SAFFMFOwner" : isAFIMSCOwner ? "AFIMSCOwner" : isSAFFMBOwner ? "SAFFMBOwner" : isCPTSCatOwner ? "CPTSCatOwner" : isCPTSOwner ? "CPTSOwner" : isQandA ? "QandAOwner" : isFeedbackOwners ? "FeedbackOwners" : "");
	var isAlldayEvent = $("#AddAlldayEvent").is(":checked");
	var isRecurrenceEvent = $('#AddRecurrenceEvent').is(":checked");
	EventDate = formDateforEvent($('#AddEventStartDate').val(), $('#AddEventStartHours').val(), $('#AddEventStartMins').val(), "StartDate", isAlldayEvent);
	EndDate = formDateforEvent($('#AddEventEndDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);

	if ($('#AddCategorySelecetdChoice').is(":checked")) {
		Category = $("#AddCategorySelectedValue").val();
	} else if ($('#AddCategoryUserChoice').is(":checked")) {
		Category = $('#AddCategoryUsersValue').val();
	}

	if (!isRecurrenceEvent) {
		addEventData = {
			__metadata: {
				"type": "SP.Data." + calendarListName + "ListItem"
			},
			"Title": $("#AddEventTitle").val(),
			"Location": $("#AddEventLocation").val(),
			"EventDate": EventDate,
			"EndDate": EndDate,
			"fAllDayEvent": isAlldayEvent,
			"fRecurrence": isRecurrenceEvent,
			"Description": $("#AddEventDescription").val(),
			"Category": Category,
			"Is_x0020__x0020_Archive": $("#AddIsArchiveEvent").is(":checked"),
			"CPTS": CPTS,
			"MAJCOM": MAJCOM,
			"Role": Role,
			"FY": String(FY),
			"CSPCategoryId": CSPCategoryId,
			"AssignedComponent": AssignedComponent
		};
		addEventFiles = {
			"Files": eventAttachmentsArray,
		}
		if (ValidateEvent(addEventData, "Add") && allowAddRequest) {
			allowAddRequest = false;
			addEventToCalendar(addEventData, addEventFiles);
		}

	} else {
		var guid = createGuid();
		EventDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventStartHours').val(), $('#AddEventStartMins').val(), "StartDate", isAlldayEvent);
		EndDate = formDateforEvent($('#windowEnd_windowEndDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
		addEventData = {
			"__metadata": {
				"type": "SP.Data." + calendarListName + "ListItem"
			},
			"Title": $("#AddEventTitle").val(),
			"Location": $("#AddEventLocation").val(),
			"EventDate": EventDate,
			"EndDate": EndDate,
			"fAllDayEvent": isAlldayEvent,
			"fRecurrence": isRecurrenceEvent,
			"Description": $("#AddEventDescription").val(),
			"Category": Category,
			"CPTS": CPTS,
			"MAJCOM": MAJCOM,
			"Role": Role,
			"FY": String(FY),
			"CSPCategoryId": CSPCategoryId,
			"TimeZone": 0,
			"UID": guid,
			"AssignedComponent": AssignedComponent,
			"EventType": 1
		};
		addEventFiles = {
			"Files": eventAttachmentsArray,
		}

		addEventData = getStrictRecurrenceXMLValue(addEventData, "Add");

		var finalValidation = ValidateEvent(addEventData, "Add");
		var finalValidationRecur = ValidateRecurrenceEvent(addEventData, "Add");
		if (finalValidation && finalValidationRecur && allowAddRequest) {
			allowAddRequest = false;
			addEventToCalendar(addEventData, addEventFiles);
		} else {
			$(".eventPopup .popup-body").animate({ scrollTop: scrollValue }, 600);
		}
	}
}

function addEventToCalendar(listValues, listFiles) {
	$('#pageoverlay').removeClass('hidden');
	pnpWeb.lists.getByTitle(calendarListName).items.add(listValues).then(function (data) {
		var id = data.data.ID;
		var fileCountCheckAddEve = 0;
		var AddEvefiles_d = $.Deferred();
		if (listFiles.Files.length != 0) {
			if (fileCountCheckAddEve <= listFiles.Files.length - 1) {
				loopFileUploadEvent(calendarListName, id, listFiles, fileCountCheckAddEve, AddEvefiles_d).then(
					function () { },
					function (sender, args) {
						erroruploaddata("Error uploading attachments to the event! Please try again.");
					}
				);
			}
		} else {
			AddEvefiles_d.resolve();
		}
		$.when(AddEvefiles_d).done(function () {
			allEventsData = [];
			localStorage.setItem("CSPCalendar_LMDate_" + sitename, null);
			getCalendarEventsData().then(function () {
				var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
				var activeDate = fullCalendar.getDate();
				displayCalendar();
				fullCalendar.gotoDate(activeDate);
				if (activeView != "fc-dayGridMonth-button") {
					$("." + activeView).trigger('click');
				}
				$("#AddCalendarEventPopup").hide();
				$(".backgr").hide();
				$("#pageoverlay").addClass("hidden");
			});

			var GetMCount = "";
			var Id = "";
			for (i = 0; i < LatestmodifiedDataSettings.length; i++) {
				if (LatestmodifiedDataSettings[i].Name == "CSPCalendar") {
					GetMCount = parseInt(LatestmodifiedDataSettings[i].MCount);
					Id = LatestmodifiedDataSettings[i].ID;
				}
			}
			GetMCount = JSON.stringify(GetMCount + 1);
			PortaldataListUpdate(Id, GetMCount);
		});
		allowAddRequest = true;
	}, function () {
		erroruploaddata("Error saving event! Please try again.");
		allowAddRequest = true;
	});
}
///////

///// UPDATE EVENT FUNCTIONALITY STARTS HERE /////

function updateEvent(element) {
	var editEventData, editEventFiles;
	var EventDate, EndDate;
	var Category = "";

	var CategoryId = [];
	$("#EditCalendarEventPopup .fs-option").each(function () {
		if ($(this).hasClass("selected")) {
			CategoryId.push($(this).attr("data-value"));
		}
	});
	var CSPCategoryId = {
		results: CategoryId
	};

	var isAlldayEvent = $("#EditAlldayEvent").is(":checked");
	var isRecurrenceEvent = $('#EditRecurrenceEvent').is(":checked");

	EventDate = formDateforEvent($('#EditEventStartDate').val(), $('#EditEventStartHours').val(), $('#EditEventStartMins').val(), "StartDate", isAlldayEvent);
	EndDate = formDateforEvent($('#EditEventEndDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);

	if ($('#EditCategorySelecetdChoice').is(":checked")) {
		Category = $("#EditCategorySelectedValue").val();
	} else if ($('#EditCategoryUserChoice').is(":checked")) {
		Category = $('#EditCategoryUsersValue').val();
	}
	var EditAssignedComponent=$("#EditAssignedComponent").val();
	 if(AssignedComptext!=EditAssignedComponent){
        var CPTS="ALL";
        var MAJCOM="ALL";
    }
	if (!isRecurrenceEvent) {
		editEventData = {
			__metadata: {
				type: "SP.Data." + calendarListName + "ListItem"
			},
			"Title": $("#EditEventTitle").val(),
			"Location": $("#EditEventLocation").val(),
			"EventDate": EventDate,
			"EndDate": EndDate,
			"fAllDayEvent": isAlldayEvent,
			"fRecurrence": isRecurrenceEvent,
			"Description": $("#EditEventDescription").val(),
			"Category": Category,
			"Is_x0020__x0020_Archive": $("#EditIsArchiveEvent").is(":checked"),
			"CSPCategoryId": CSPCategoryId,
			"CPTS":CPTS,
			"MAJCOM":MAJCOM,
			"AssignedComponent":EditAssignedComponent,
		};
		editEventFiles = {
			"Files": eventAttachmentsArray,
		}
		if (ValidateEvent(editEventData, "Update")) {
			var id = $("#EditCalendarEventPopup").attr('eventId');
			updateEventWithAttachments(calendarListName, editEventData, editEventFiles, parseInt(id));
		}
	} else {
		var guid = createGuid();
		EventDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventStartHours').val(), $('#EditEventStartMins').val(), "StartDate", isAlldayEvent);
		EndDate = formDateforEvent($('#EditwindowEnd_windowEndDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
		editEventData = {
			"__metadata": {
				"type": "SP.Data." + calendarListName + "ListItem"
			},
			"Title": $("#EditEventTitle").val(),
			"Location": $("#EditEventLocation").val(),
			"EventDate": EventDate,
			"EndDate": EndDate,
			"fAllDayEvent": isAlldayEvent,
			"fRecurrence": isRecurrenceEvent,
			"Description": $("#EditEventDescription").val(),
			"Category": Category,
			"Is_x0020__x0020_Archive": $("#EditIsArchiveEvent").is(":checked"),
			"CSPCategoryId": CSPCategoryId,
			"TimeZone": 0,
			"UID": guid,
			"CPTS":CPTS,
			"MAJCOM":MAJCOM,
			"AssignedComponent":EditAssignedComponent,
			"EventType": 1
		};
		editEventFiles = {
			"Files": eventAttachmentsArray,
		}

		editEventData = getStrictRecurrenceXMLValue(editEventData, "Update");

		var finalValidation = ValidateEvent(editEventData, "Update");
		var finalValidationRecur = ValidateRecurrenceEvent(editEventData, "Update");
		if (finalValidation && finalValidationRecur) {
			var id = $("#EditCalendarEventPopup").attr('eventId');
			updateEventWithAttachments(calendarListName, editEventData, editEventFiles, parseInt(id));
		} else {
			$(".eventPopup .popup-body").animate({ scrollTop: scrollValue }, 600);
		}
	}
}

function updateEventWithAttachments(listName, listValues, listFiles, ItemId) {
	$("#pageoverlay").removeClass("hidden");
	var surl = siteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items('" + ItemId + "')";
	var d = $.Deferred();
	UpdateData(surl, listValues, d, true).done(function (data) {
		var fileCountCheckCal = 0;
		var calEventEdit_d = $.Deferred();
		if (listFiles.Files.length > 0) {
			if (fileCountCheckCal <= listFiles.Files.length - 1) {
				loopFileUploadEvent(listName, ItemId, listFiles, fileCountCheckCal, calEventEdit_d).then(
					function () { },
					function (sender, args) {
						erroruploaddata("Error uploading attachments to the event! Please try again.");
					}
				);
			}
		} else {
			calEventEdit_d.resolve();
		}
		var deletedCount = 0;
		var calEventDelete_d = $.Deferred();
		if (deletedAttachmentArray.length > 0) {
			$(deletedAttachmentArray).each(function (i, val) {
				DeleteItemAttachment(ItemId, val, listName, calEventDelete_d).then(function () {
					deletedCount++;
					if (deletedCount == deletedAttachmentArray.length) {
						calEventDelete_d.resolve();
					}
				});
			});
		} else {
			calEventDelete_d.resolve();
		}
		$.when(calEventEdit_d, calEventDelete_d).done(function () {
			console.log("Event Updated ", data);
			allEventsData = [];
			localStorage.setItem("CSPCalendar_LMDate_" + sitename, null);
			getCalendarEventsData().then(function () {
				var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
				var activeDate = fullCalendar.getDate();
				displayCalendar();
				fullCalendar.gotoDate(activeDate);
				if (activeView != "fc-dayGridMonth-button") {
					$("." + activeView).trigger('click');
				}
				$("#EditCalendarEventPopup").hide();
				$(".backgr").hide();
				$('#pageoverlay').addClass('hidden');
			});

			var GetMCount = "";
			var Id = "";
			for (i = 0; i < LatestmodifiedDataSettings.length; i++) {
				if (LatestmodifiedDataSettings[i].Name == "CSPCalendar") {
					GetMCount = parseInt(LatestmodifiedDataSettings[i].MCount);
					Id = LatestmodifiedDataSettings[i].ID;
				}
			}
			GetMCount = JSON.stringify(GetMCount + 1);
			PortaldataListUpdate(Id, GetMCount);
		})
	});
}
///////

////// DELETE EVENT FUNCTIONALITY STARTS HERE /////

function deleteEvent(element) {
	if (confirm(" Are you sure, you want to delete the selected event?")) {
		$('#pageoverlay').removeClass('hidden');
		$("#EditCalendarEventPopup").hide();
		$(".backgr").hide();
		var id = $("#EditCalendarEventPopup").attr('eventId');
		var d = $.Deferred();
		var url = siteUrl + "/_api/web/lists/GetByTitle('" + calendarListName + "')/items(" + id + ")";
		deleteItem(url, d).done(function () {
			console.log("Event Deleted ");
			allEventsData = [];
			localStorage.setItem("CSPCalendar_LMDate_" + sitename, null);
			getCalendarEventsData().then(function () {
				var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
				var activeDate = fullCalendar.getDate();
				displayCalendar();
				fullCalendar.gotoDate(activeDate);
				if (activeView != "fc-dayGridMonth-button") {
					$("." + activeView).trigger('click');
				}
				$('#pageoverlay').addClass('hidden');
			});

			var GetMCount = "";
			var Id = "";
			for (i = 0; i < LatestmodifiedDataSettings.length; i++) {
				if (LatestmodifiedDataSettings[i].Name == "CSPCalendar") {
					GetMCount = parseInt(LatestmodifiedDataSettings[i].MCount);
					Id = LatestmodifiedDataSettings[i].ID;
				}
			}
			GetMCount = JSON.stringify(GetMCount + 1);
			PortaldataListUpdate(Id, GetMCount);
		}).fail(function () {
			erroruploaddata("Error deleting event! Please try again.");
		});
	}
}
///////

////// Files Uploading Functions for Calendar Starts Here //////

function loopFileUploadEvent(listName, id, listValues, fileCountCheck, fileUploadDfd) {
	uploadEventFile(listName, id, listValues.Files[fileCountCheck]).then(function (data) {
		var objcontext = new SP.ClientContext();
		var targetList = objcontext.get_web().get_lists().getByTitle(listName);
		var listItem = targetList.getItemById(id);
		objcontext.load(listItem);
		objcontext.executeQueryAsync(function () {
			fileCountCheck++;
			if (fileCountCheck <= listValues.Files.length - 1) {
				loopFileUploadEvent(listName, id, listValues, fileCountCheck, fileUploadDfd);
			} else {
				fileUploadDfd.resolve();
			}
		});
	}, function (sender, args) {
		fileUploadDfd.reject(sender, args);
		erroruploaddata("Error uploading attachments to the event! Please try again.");
	});
	return fileUploadDfd.promise();
}

function uploadEventFile(listName, id, file) {
	var deferred = $.Deferred();
	getFileBuffer(file).then(function (buffer) {
		var bytes = new Uint8Array(buffer);
		var binary = '';
		for (var b = 0; b < bytes.length; b++) {
			binary += String.fromCharCode(bytes[b]);
		}
		var scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";
		$.getScript(scriptbase + "SP.RequestExecutor.js", function () {
			var createitem = new SP.RequestExecutor(_spPageContextInfo.webServerRelativeUrl);
			createitem.executeAsync({
				url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + file.name + "')",
				method: "POST",
				binaryStringRequestBody: true,
				body: binary,
				success: fsucc,
				error: ferr,
				state: "Update"
			});
			function fsucc(data) {
				deferred.resolve(data);
			}
			function ferr(data) {
				deferred.reject(data);
			}
		});
	}, function (sender, args) {
		deferred.reject(sender, args);
	});
	return deferred.promise();
}

function getFileBuffer(file) {
	var deferred = $.Deferred();
	var reader = new FileReader();
	reader.onload = function (e) {
		deferred.resolve(e.target.result);
	}
	reader.onerror = function (e) {
		deferred.reject(e.target.error);
	}
	reader.readAsArrayBuffer(file);
	return deferred.promise();
}
///////

function getStrictRecurrenceXMLValue(eventData, XMLRequestType) { //// Returns standard XML format for selecetd recurring event from user input values ////
	var recurrenceType, dailyRecurType, dailyRecurFrequency, weeklyRecurFrequency;
	var RecurEndType, RecurEndAfterInstances, RecurEndDate;
	var finalRecurXMLData;
	var isAlldayEvent = eventData.fAllDayEvent;

	var monthlyRecurType, monthlyDayOf, monthFrequency, monthlyByDay_weekOfMonth, monthlyByDay_day, monthlyByDay_monthFrequency;
	var yearlyRecurType, yearlyFrequency, yearly_month, yearly_day, yearlyByDay_weekOfMonth, yearlyByDay_day, yearlyByDay_month, selectedMonthMaxDays;

	var endByTempDate;

	if (XMLRequestType == "Add") {
		recurrenceType = $('#AddCalendarEventPopup input[name$="recurrence-list"]:checked').val();

		dailyRecurType = $('#dailyDiv input[name$="dailyRecurType"]:checked').val();
		dailyRecurFrequency = parseInt($("#dailyDiv input[name$='dailyRecurFrequency']").val());
		weeklyRecurFrequency = parseInt($("#weeklyDiv input[name$='weeklyRecurFrequency']").val());
		monthlyRecurType = $("#monthlyDiv input[name$='monthlyRecurType']:checked").val();
		monthlyDayOf = parseInt($("#monthlyDiv input[name$='monthlyDayOf']").val());
		monthFrequency = parseInt($("#monthlyDiv input[name$='monthFrequency']").val());
		monthlyByDay_weekOfMonth = $("#monthlyDiv select[name$='monthlyByDay_weekOfMonth']").val();
		monthlyByDay_day = $("#monthlyDiv select[name$='monthlyByDay_day']").val();
		monthlyByDay_monthFrequency = parseInt($("#monthlyDiv input[name$='monthlyByDay_monthFrequency']").val());
		yearlyRecurType = $("#YearlyDiv input[name$='yearlyRecurType']:checked").val();
		yearlyFrequency = parseInt($("#YearlyDiv input[name$='yearlyFrequency']").val());
		yearly_month = $("#YearlyDiv select[name$='yearly_month']").val();
		yearly_day = parseInt($("#YearlyDiv input[name$='yearly_day']").val());
		yearlyByDay_weekOfMonth = $("#YearlyDiv select[name$='yearlyByDay_weekOfMonth']").val();
		yearlyByDay_day = $("#YearlyDiv select[name$='yearlyByDay_day']").val();
		yearlyByDay_month = parseInt($("#YearlyDiv select[name$='yearlyByDay_month']").val());

		//// Forming End Date based on add input values ////
		RecurEndType = $('#AddCalendarEventPopup input[name="EndDateRangeType"]:checked').val();
		RecurEndAfterInstances = parseInt($('#EndafterInstances').val());
		RecurEndDate = (eventData.EndDate instanceof Date) ? eventData.EndDate : null;

		if (RecurEndType == "Noenddate") {
			var today = new Date();
			var endAfterYears = ((recurrenceType == "daily") ? 40 : (recurrenceType == "weekly") ? 60 : (recurrenceType == "monthly") ? 80 : (recurrenceType == "yearly") ? 120 : null);
			if (endAfterYears) {
				var makeEndDate = new Date(today.setFullYear(today.getFullYear() + endAfterYears)).format('MM/dd/yyyy');
				RecurEndDate = formDateforEvent(makeEndDate, $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent)
			}
		} else if (RecurEndType == "Endafter") {
			if (recurrenceType == "daily") {
				if (dailyRecurType == "Every") {
					RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999) {
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setDate(RecurEndDate.getDate() + (dailyRecurFrequency * (RecurEndAfterInstances - 1)))) : null);
					}
				} else if (dailyRecurType == "EveryWeekday") {
					RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999) {
						var noOfDaysToAdd = RecurEndAfterInstances - 1;
						var count = 0;
						while (count < noOfDaysToAdd) {
							RecurEndDate = new Date(RecurEndDate.setDate(RecurEndDate.getDate() + 1));
							if (RecurEndDate.getDay() != 0 && RecurEndDate.getDay() != 6) {
								count++;
							}
						}
					}
				}
			} else if (recurrenceType == "weekly") {
				RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
				var finalWeekDay = '';
				var parsedInstances = 0;
				var checkedWeekDays = $("#weeklyDiv input[type='checkbox']:checked");
				if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && checkedWeekDays && checkedWeekDays.length > 0 && weeklyRecurFrequency && weeklyRecurFrequency > 0) {
					var weekDayKey = WeeklyFrequencySet.get(RecurEndDate.toDateString().split(" ")[0].slice(0, -1).toLowerCase());
					checkedWeekDays.each(function (index) {
						if ($(this).attr("key") >= weekDayKey && RecurEndAfterInstances > parsedInstances) {
							parsedInstances++;
							finalWeekDay = $(this).val();
						}
					});
					if (RecurEndAfterInstances > parsedInstances) {
						instanceCallback();
						function instanceCallback() {
							RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setDate(RecurEndDate.getDate() + (weeklyRecurFrequency * 7))) : null);
							checkedWeekDays.each(function (index) {
								if (RecurEndAfterInstances > parsedInstances) {
									parsedInstances++;
									finalWeekDay = $(this).val();
								}
							});
							if (RecurEndAfterInstances > parsedInstances) {
								instanceCallback();
							} else {
								RecurEndDate = ((RecurEndDate instanceof Date && finalWeekDay) ? getDayWithinTheWeekFromDate(RecurEndDate, WeeklyFrequencySet.get(finalWeekDay)) : null);
							}
						}
					} else {
						RecurEndDate = ((RecurEndDate instanceof Date && finalWeekDay) ? getDayWithinTheWeekFromDate(RecurEndDate, WeeklyFrequencySet.get(finalWeekDay)) : null);
					}
				}
			} else if (recurrenceType == "monthly") {
				if (monthlyRecurType == "Day") {
					RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999) {
						var monthStartDayKey = RecurEndDate.getDate();
						if (monthStartDayKey <= monthlyDayOf) {
							parsedInstances--;
						}
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setMonth(RecurEndDate.getMonth() + (monthFrequency * parsedInstances))) : null);
						RecurEndDate = new Date(RecurEndDate.setDate(monthlyDayOf));
					}
				} else if (monthlyRecurType == "The") {
					RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && monthlyByDay_monthFrequency && monthlyByDay_monthFrequency > 0) {
						var weekday = WeeklyFrequencySet.get(monthlyByDay_day);
						var n = (monthlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, RecurEndDate) : monthFrequencySet.get(monthlyByDay_weekOfMonth));
						dateForSelectedInputValues = nthWeekdayOfMonth(weekday, n, RecurEndDate);
						if (dateForSelectedInputValues >= RecurEndDate.setHours(0, 0, 0, 0)) {
							parsedInstances--;
						}
						RecurEndDate.setDate(1);
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setMonth(RecurEndDate.getMonth() + (monthlyByDay_monthFrequency * parsedInstances))) : null);
						var n = (monthlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, RecurEndDate) : monthFrequencySet.get(monthlyByDay_weekOfMonth));
						RecurEndDate = nthWeekdayOfMonth(weekday, n, RecurEndDate);
						//In the above condition hours are set to zero, hence again adding hours for the finally formed date in the below line from user input.
						RecurEndDate = formDateforEvent(RecurEndDate.format("MM/dd/yyyy"), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					}
				}
			} else if (recurrenceType == "yearly") {
				if (yearlyRecurType == "On") {
					selectedMonthMaxDays = 31;
					RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && yearlyFrequency && yearlyFrequency > 0 && yearly_day <= selectedMonthMaxDays) {
						var dateForSelectedInputValues = new Date(RecurEndDate.getFullYear() + "/" + $("#YearlyDiv select[name$='yearly_month']").val() + "/" + parseInt($("#YearlyDiv input[name$='yearly_day']").val()));
						if (dateForSelectedInputValues >= RecurEndDate.setHours(0, 0, 0, 0)) {
							parsedInstances--;
						}
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setFullYear(RecurEndDate.getFullYear() + (yearlyFrequency * parsedInstances))) : null);
						RecurEndDate = formDateforEvent(RecurEndDate.format("MM/dd/yyyy"), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
						RecurEndDate = new Date(RecurEndDate.setDate(yearly_day));
					}
				} else if (yearlyRecurType == "Onthe") {
					RecurEndDate = formDateforEvent($('#windowStart_windowStartDate').val(), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && yearlyFrequency && yearlyFrequency > 0) {
						var weekday = WeeklyFrequencySet.get(yearlyByDay_day);
						var dateForSelectedInputValues = new Date(RecurEndDate.getFullYear() + '-' + yearlyByDay_month);
						var n = (yearlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, dateForSelectedInputValues) : monthFrequencySet.get(yearlyByDay_weekOfMonth));
						dateForSelectedInputValues = nthWeekdayOfMonth(weekday, n, dateForSelectedInputValues);
						if (dateForSelectedInputValues >= RecurEndDate.setHours(0, 0, 0, 0)) {
							parsedInstances--;
						}
						dateForSelectedInputValues.setDate(1);
						dateForSelectedInputValues = (dateForSelectedInputValues instanceof Date ? new Date(dateForSelectedInputValues.setFullYear(dateForSelectedInputValues.getFullYear() + (yearlyFrequency * parsedInstances))) : null);
						var n = (yearlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, dateForSelectedInputValues) : monthFrequencySet.get(yearlyByDay_weekOfMonth));
						RecurEndDate = nthWeekdayOfMonth(weekday, n, dateForSelectedInputValues);
						//In the above condition hours are set to zero, hence again adding hours for the finally formed date in the below line from user input.
						RecurEndDate = formDateforEvent(RecurEndDate.format("MM/dd/yyyy"), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					}
				}
			}
		}
		////****////

	} else if (XMLRequestType == "Update") {
		recurrenceType = $('#EditCalendarEventPopup input[name$="recurrence-list"]:checked').val();

		dailyRecurType = $('#EditdailyDiv input[name$="dailyRecurType"]:checked').val();
		dailyRecurFrequency = parseInt($("#EditdailyDiv input[name$='dailyRecurFrequency']").val());
		weeklyRecurFrequency = parseInt($("#EditweeklyDiv input[name$='weeklyRecurFrequency']").val());
		monthlyRecurType = $("#EditmonthlyDiv input[name$='monthlyRecurType']:checked").val();
		monthlyDayOf = parseInt($("#EditmonthlyDiv input[name$='monthlyDayOf']").val());
		monthFrequency = parseInt($("#EditmonthlyDiv input[name$='monthFrequency']").val());
		monthlyByDay_weekOfMonth = $("#EditmonthlyDiv select[name$='monthlyByDay_weekOfMonth']").val();
		monthlyByDay_day = $("#EditmonthlyDiv select[name$='monthlyByDay_day']").val();
		monthlyByDay_monthFrequency = parseInt($("#EditmonthlyDiv input[name$='monthlyByDay_monthFrequency']").val());
		yearlyRecurType = $("#EditYearlyDiv input[name$='yearlyRecurType']:checked").val();
		yearlyFrequency = parseInt($("#EditYearlyDiv input[name$='yearlyFrequency']").val());
		yearly_month = $("#EditYearlyDiv select[name$='yearly_month']").val();
		yearly_day = parseInt($("#EditYearlyDiv input[name$='yearly_day']").val());
		yearlyByDay_weekOfMonth = $("#EditYearlyDiv select[name$='yearlyByDay_weekOfMonth']").val();
		yearlyByDay_day = $("#EditYearlyDiv select[name$='yearlyByDay_day']").val();
		yearlyByDay_month = parseInt($("#EditYearlyDiv select[name$='yearlyByDay_month']").val());

		//// Forming End Date based on updated input values ////
		RecurEndType = $('#EditCalendarEventPopup input[name="EndDateRangeType"]:checked').val();
		RecurEndAfterInstances = parseInt($('#EditEndafterInstances').val());
		RecurEndDate = (eventData.EndDate instanceof Date) ? eventData.EndDate : null;

		if (RecurEndType == "Noenddate") {
			var today = new Date();
			var endAfterYears = ((recurrenceType == "daily") ? 40 : (recurrenceType == "weekly") ? 60 : (recurrenceType == "monthly") ? 80 : (recurrenceType == "yearly") ? 120 : null);
			if (endAfterYears) {
				var makeEndDate = new Date(today.setFullYear(today.getFullYear() + endAfterYears)).format('MM/dd/yyyy');
				RecurEndDate = formDateforEvent(makeEndDate, $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
			}
		} else if (RecurEndType == "Endafter") {
			if (recurrenceType == "daily") {
				if (dailyRecurType == "Every") {
					RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999) {
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setDate(RecurEndDate.getDate() + (dailyRecurFrequency * (RecurEndAfterInstances - 1)))) : null);
					}
				} else if (dailyRecurType == "EveryWeekday") {
					RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent)
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999) {
						var noOfDaysToAdd = RecurEndAfterInstances - 1;
						var count = 0;
						while (count < noOfDaysToAdd) {
							RecurEndDate = new Date(RecurEndDate.setDate(RecurEndDate.getDate() + 1));
							if (RecurEndDate.getDay() != 0 && RecurEndDate.getDay() != 6) {
								count++;
							}
						}
					}
				}
			} else if (recurrenceType == "weekly") {
				RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
				var finalWeekDay = '';
				var parsedInstances = 0;
				var checkedWeekDays = $("#EditweeklyDiv input[type='checkbox']:checked");
				if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && checkedWeekDays && checkedWeekDays.length > 0 && weeklyRecurFrequency && weeklyRecurFrequency > 0) {
					var weekDayKey = WeeklyFrequencySet.get(RecurEndDate.toDateString().split(" ")[0].slice(0, -1).toLowerCase());
					checkedWeekDays.each(function (index) {
						if ($(this).attr("key") >= weekDayKey && RecurEndAfterInstances > parsedInstances) {
							parsedInstances++;
							finalWeekDay = $(this).val();
						}
					});
					if (RecurEndAfterInstances > parsedInstances) {
						instanceCallback();
						function instanceCallback() {
							RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setDate(RecurEndDate.getDate() + (weeklyRecurFrequency * 7))) : null);
							checkedWeekDays.each(function (index) {
								if (RecurEndAfterInstances > parsedInstances) {
									parsedInstances++;
									finalWeekDay = $(this).val();
								}
							});
							if (RecurEndAfterInstances > parsedInstances) {
								instanceCallback();
							} else {
								RecurEndDate = ((RecurEndDate instanceof Date && finalWeekDay) ? getDayWithinTheWeekFromDate(RecurEndDate, WeeklyFrequencySet.get(finalWeekDay)) : null);
							}
						}
					} else {
						RecurEndDate = ((RecurEndDate instanceof Date && finalWeekDay) ? getDayWithinTheWeekFromDate(RecurEndDate, WeeklyFrequencySet.get(finalWeekDay)) : null);
					}
				}
			} else if (recurrenceType == "monthly") {
				if (monthlyRecurType == "Day") {
					RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999) {
						var monthStartDayKey = RecurEndDate.getDate();
						if (monthStartDayKey <= monthlyDayOf) {
							parsedInstances--;
						}
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setMonth(RecurEndDate.getMonth() + (monthFrequency * parsedInstances))) : null);
						RecurEndDate = new Date(RecurEndDate.setDate(monthlyDayOf));
					}
				} else if (monthlyRecurType == "The") {
					RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && monthlyByDay_monthFrequency && monthlyByDay_monthFrequency > 0) {
						var weekday = WeeklyFrequencySet.get(monthlyByDay_day);
						var n = (monthlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, RecurEndDate) : monthFrequencySet.get(monthlyByDay_weekOfMonth));
						dateForSelectedInputValues = nthWeekdayOfMonth(weekday, n, RecurEndDate);
						if (dateForSelectedInputValues >= RecurEndDate.setHours(0, 0, 0, 0)) {
							parsedInstances--;
						}
						RecurEndDate.setDate(1);
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setMonth(RecurEndDate.getMonth() + (monthlyByDay_monthFrequency * parsedInstances))) : null);
						var n = (monthlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, RecurEndDate) : monthFrequencySet.get(monthlyByDay_weekOfMonth));
						RecurEndDate = nthWeekdayOfMonth(weekday, n, RecurEndDate);
						//In the above condition hours are set to zero, hence again adding hours for date in the below line based on user input.
						RecurEndDate = formDateforEvent(RecurEndDate.format("MM/dd/yyyy"), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
					}
				}
			} else if (recurrenceType == "yearly") {
				if (yearlyRecurType == "On") {
					selectedMonthMaxDays = 31;
					RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && yearlyFrequency && yearlyFrequency > 0 && yearly_day <= selectedMonthMaxDays) {
						var dateForSelectedInputValues = new Date(RecurEndDate.getFullYear() + "/" + $("#EditYearlyDiv select[name$='yearly_month']").val() + "/" + parseInt($("#EditYearlyDiv input[name$='yearly_day']").val()));
						if (dateForSelectedInputValues >= RecurEndDate.setHours(0, 0, 0, 0)) {
							parsedInstances--;
						}
						RecurEndDate = (RecurEndDate instanceof Date ? new Date(RecurEndDate.setFullYear(RecurEndDate.getFullYear() + (yearlyFrequency * parsedInstances))) : null);
						RecurEndDate = formDateforEvent(RecurEndDate.format("MM/dd/yyyy"), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
						RecurEndDate = new Date(RecurEndDate.setDate(yearly_day));
					}
				} else if (yearlyRecurType == "Onthe") {
					RecurEndDate = formDateforEvent($('#EditwindowStart_windowStartDate').val(), $('#EditEventEndHours').val(), $('#EditEventEndMins').val(), "EndDate", isAlldayEvent);
					var parsedInstances = RecurEndAfterInstances;
					if (RecurEndDate instanceof Date && RecurEndAfterInstances && RecurEndAfterInstances >= 1 && RecurEndAfterInstances <= 999 && yearlyFrequency && yearlyFrequency > 0) {
						var weekday = WeeklyFrequencySet.get(yearlyByDay_day);
						var dateForSelectedInputValues = new Date(RecurEndDate.getFullYear() + '-' + yearlyByDay_month);
						var n = (yearlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, dateForSelectedInputValues) : monthFrequencySet.get(yearlyByDay_weekOfMonth));
						dateForSelectedInputValues = nthWeekdayOfMonth(weekday, n, dateForSelectedInputValues);
						if (dateForSelectedInputValues >= RecurEndDate.setHours(0, 0, 0, 0)) {
							parsedInstances--;
						}
						dateForSelectedInputValues.setDate(1);
						dateForSelectedInputValues = (dateForSelectedInputValues instanceof Date ? new Date(dateForSelectedInputValues.setFullYear(dateForSelectedInputValues.getFullYear() + (yearlyFrequency * parsedInstances))) : null);
						var n = (yearlyByDay_weekOfMonth == "last" ? getLastOccurence(weekday, dateForSelectedInputValues) : monthFrequencySet.get(yearlyByDay_weekOfMonth));
						RecurEndDate = nthWeekdayOfMonth(weekday, n, dateForSelectedInputValues);
						//In the above condition hours are set to zero, hence again adding hours for the finally formed date in the below line from user input.
						RecurEndDate = formDateforEvent(RecurEndDate.format("MM/dd/yyyy"), $('#AddEventEndHours').val(), $('#AddEventEndMins').val(), "EndDate", isAlldayEvent);
					}
				}
			}
		}
	}
	//******//

	//// Forming Recurring XML for final input values ////

	if (recurrenceType == "daily") {
		if (dailyRecurType == "Every") {
			if (RecurEndType == "Noenddate") {
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><daily dayFrequency='" + dailyRecurFrequency + "' /></repeat><repeatForever>FALSE</repeatForever></rule></recurrence>";
			}
			else if (RecurEndType == "Endafter") {
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><daily dayFrequency='" + dailyRecurFrequency + "' /></repeat><repeatInstances>" + RecurEndAfterInstances + "</repeatInstances></rule></recurrence>";
			}
			else if (RecurEndType == "Endby") {
				endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><daily dayFrequency='" + dailyRecurFrequency + "' /></repeat><windowEnd>" + endByTempDate + "</windowEnd></rule></recurrence>";
			}
		} else if (dailyRecurType == "EveryWeekday") {
			if (RecurEndType == "Noenddate") {
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><daily weekday='TRUE' /></repeat><repeatForever>FALSE</repeatForever></rule></recurrence>";
			}
			else if (RecurEndType == "Endafter") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><daily weekday="TRUE" /></repeat>' + "<repeatInstances>" + RecurEndAfterInstances + "</repeatInstances></rule></recurrence><weekly mo='TRUE' tu='TRUE' we='TRUE' th='TRUE' fr='TRUE' weekFrequency='1' />";
			}
			else if (RecurEndType == "Endby") {
				endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><daily weekday='TRUE' /></repeat><windowEnd>" + endByTempDate + "</windowEnd></rule></recurrence>";
			}
		}
	} else if (recurrenceType == "weekly") {
		var id = (XMLRequestType == "Add") ? "weeklyDiv" : "EditweeklyDiv";
		var weeklyXML = "<weekly ";
		$("#" + id + " " + "input[type='checkbox']:checked").each(function () {
			weeklyXML += $(this).val() + '="TRUE" ';
		});
		weeklyXML += 'weekFrequency="' + weeklyRecurFrequency + '" />';

		if (RecurEndType == "Noenddate") {
			finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat>" + weeklyXML + "</repeat><repeatForever>FALSE</repeatForever></rule></recurrence>";
		}
		else if (RecurEndType == "Endafter") {
			finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat>" + weeklyXML + "</repeat><repeatInstances>" + RecurEndAfterInstances + "</repeatInstances></rule></recurrence>";
		}
		else if (RecurEndType == "Endby") {
			endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
			finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat>" + weeklyXML + "</repeat><windowEnd>" + endByTempDate + "</windowEnd></rule></recurrence>";
		}
	} else if (recurrenceType == "monthly") {
		if (monthlyRecurType == "Day") {
			if (RecurEndType == "Noenddate") {
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><monthly monthFrequency='" + monthFrequency + "' day='" + monthlyDayOf + "' /></repeat><repeatForever>FALSE</repeatForever></rule></recurrence>";
			}
			else if (RecurEndType == "Endafter") {
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><monthly monthFrequency='" + monthFrequency + "' day='" + monthlyDayOf + "' /></repeat><repeatInstances>" + RecurEndAfterInstances + "</repeatInstances></rule></recurrence>";
			}
			else if (RecurEndType == "Endby") {
				endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
				finalRecurXMLData = "<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><monthly monthFrequency='" + monthFrequency + "' day='" + monthlyDayOf + "' /></repeat><windowEnd>" + endByTempDate + "</windowEnd></rule></recurrence>";
			}
		} else if (monthlyRecurType == "The") {
			if (RecurEndType == "Noenddate") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><monthlyByDay ' + monthlyByDay_day + '="TRUE" weekdayOfMonth="' + monthlyByDay_weekOfMonth + '" monthFrequency="' + monthlyByDay_monthFrequency + '" /></repeat><repeatForever>FALSE</repeatForever></rule></recurrence>';
			}
			else if (RecurEndType == "Endafter") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><monthlyByDay ' + monthlyByDay_day + '="TRUE" weekdayOfMonth="' + monthlyByDay_weekOfMonth + '" monthFrequency="' + monthlyByDay_monthFrequency + '" /></repeat><repeatInstances>' + RecurEndAfterInstances + '</repeatInstances></rule></recurrence>';
			}
			else if (RecurEndType == "Endby") {
				endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><monthlyByDay ' + monthlyByDay_day + '="TRUE" weekdayOfMonth="' + monthlyByDay_weekOfMonth + '" monthFrequency="' + monthlyByDay_monthFrequency + '" /></repeat><windowEnd>' + endByTempDate + '</windowEnd></rule></recurrence>';
			}
		}
	} else if (recurrenceType == "yearly") {
		if (yearlyRecurType == "On") {
			if (RecurEndType == "Noenddate") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><yearly yearFrequency="' + yearlyFrequency + '" month="' + yearly_month + '" day="' + yearly_day + '" /></repeat><repeatForever>FALSE</repeatForever></rule></recurrence>';
			}
			else if (RecurEndType == "Endafter") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><yearly yearFrequency="' + yearlyFrequency + '" month="' + yearly_month + '" day="' + yearly_day + '" /></repeat><repeatInstances>' + RecurEndAfterInstances + '</repeatInstances></rule></recurrence>';
			}
			else if (RecurEndType == "Endby") {
				endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><yearly yearFrequency="' + yearlyFrequency + '" month="' + yearly_month + '" day="' + yearly_day + '" /></repeat><windowEnd>' + endByTempDate + '</windowEnd></rule></recurrence>';
			}
		} else if (yearlyRecurType == "Onthe") {
			if (RecurEndType == "Noenddate") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><yearlyByDay yearFrequency="' + yearlyFrequency + '" ' + yearlyByDay_day + '="TRUE" weekdayOfMonth="' + yearlyByDay_weekOfMonth + '" month="' + yearlyByDay_month + '" /></repeat><repeatForever>FALSE</repeatForever></rule></recurrence>';
			}
			else if (RecurEndType == "Endafter") {
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><yearlyByDay yearFrequency="' + yearlyFrequency + '" ' + yearlyByDay_day + '="TRUE" weekdayOfMonth="' + yearlyByDay_weekOfMonth + '" month="' + yearlyByDay_month + '" /></repeat><repeatInstances>' + RecurEndAfterInstances + '</repeatInstances></rule></recurrence>';
			}
			else if (RecurEndType == "Endby") {
				endByTempDate = (RecurEndDate instanceof Date && RecurEndDate != "Invalid Date") ? RecurEndDate.toISOString().split('.')[0] + "Z" : RecurEndDate;
				finalRecurXMLData = '<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat><yearlyByDay yearFrequency="' + yearlyFrequency + '" ' + yearlyByDay_day + '="TRUE" weekdayOfMonth="' + yearlyByDay_weekOfMonth + '" month="' + yearlyByDay_month + '" /></repeat><windowEnd>' + endByTempDate + '</windowEnd></rule></recurrence>';
			}
		}
	}

	eventData.EndDate = RecurEndDate;
	eventData.RecurrenceData = finalRecurXMLData;
	return eventData;
}

function ValidateEvent(addEventData, validateScenario) { //// Validations for non recurring inputs  ////
	scrollValue = $(".eventPopup .popup-body").scrollTop();
	var isValidEvent = true;
	var id = (validateScenario == "Add") ? "Add" : "Edit";
	var isValidDates = true;

	$(".eventPopup .errormsg").addClass("hidden").html("");

	if (!addEventData.Title.trim()) {
		eventValidationErrorMsg = "Please enter title.";
		isValidEvent = false;
		$("#" + id + "EventTitle").siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		scrollValue = 0;
	}
	else if (addEventData.Title.length > 250) {
		eventValidationErrorMsg = "Title cannot exceed 255 characters, Please enter valid title.";
		isValidEvent = false;
		$("#" + id + "EventTitle").siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		scrollValue = 0;
	}

	if (addEventData.Location && addEventData.Location.trim().length > 250) {
		eventValidationErrorMsg = "Location cannot exceed 255 characters, Please enter valid location.";
		isValidEvent = false;
		$("#" + id + "EventLocation").siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		scrollValue = 0;
	}

	if (addEventData.Category && addEventData.Category.trim().length > 250) {
		eventValidationErrorMsg = "Event category cannot exceed 255 characters, Please enter valid event category.";
		isValidEvent = false;
		$("#" + id + "CategoryUsersValue").siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		scrollValue = 0;
	}

	if (!addEventData.fRecurrence && !validateInputDateFormats($("#" + id + "EventStartDate").val())) {
		eventValidationErrorMsg = "Invalid start date.";
		isValidDates = false;
		isValidEvent = false;
		$("#" + id + "EventStartDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	else if (!addEventData.fRecurrence && !addEventData.EventDate) {
		eventValidationErrorMsg = "You must specify a value for this required field.";
		isValidDates = false;
		isValidEvent = false;
		$("#" + id + "EventStartDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	if (!addEventData.fRecurrence && !validateInputDateFormats($("#" + id + "EventEndDate").val())) {
		eventValidationErrorMsg = "Invalid end date.";
		isValidDates = false;
		isValidEvent = false;
		$("#" + id + "EventEndDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	else if (!addEventData.fRecurrence && !addEventData.EndDate) {
		eventValidationErrorMsg = "You must specify a value for this required field.";
		isValidDates = false;
		isValidEvent = false;
		$("#" + id + "EventEndDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	if (addEventData.CSPCategoryId.results.length == 0) {
		eventValidationErrorMsg = "Please select category.";
		isValidEvent = false;
		$("#" + id + "CspCategory").closest('.category-select').find(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		scrollValue = 250;
	}
	if (addEventData.AssignedComponent == "") {
		eventValidationErrorMsg = "Please select Assigned Component.";
		isValidEvent = false;
		$("#" + id + "AssignedComponent").siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		
	}

	if (!addEventData.fRecurrence && isValidDates && addEventData.EventDate.toLocaleDateString() == addEventData.EndDate.toLocaleDateString() && addEventData.EventDate.toLocaleTimeString() == addEventData.EndDate.toLocaleTimeString()) {
		eventValidationErrorMsg = "Start Time and End Time cannot be same.";
		isValidEvent = false;
		$("#" + id + "EventEndDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	if (!addEventData.fRecurrence && isValidDates && addEventData.EventDate.toLocaleDateString() == addEventData.EndDate.toLocaleDateString() && addEventData.EventDate.getTime() > addEventData.EndDate.getTime()) {
		eventValidationErrorMsg = "Start Time cannot be greater than End Time.";
		isValidEvent = false;
		$("#" + id + "EventStartDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	if (!addEventData.fRecurrence && isValidDates && (addEventData.EventDate < new Date() || addEventData.EndDate < new Date())) {
		eventValidationErrorMsg = "Event cannot be created in the past.";
		isValidEvent = false;
		$("#" + id + "EventEndDate").closest('.date-time-forms').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	return isValidEvent;
}

function ValidateRecurrenceEvent(addEventData, validateScenario) { //// Validations for recurring inputs  ////

	var isValidEvent = true;
	var id = (validateScenario == "Add") ? "" : "Edit";
	var recurrenceType, dailyRecurType, dailyRecurFrequency, weeklyRecurFrequency;
	var RecurEndType, RecurEndAfterInstances, RecurEndDate;
	var monthlyRecurType, monthlyDayOf, monthFrequency, monthlyByDay_monthFrequency;
	var yearlyRecurType, yearlyFrequency, yearly_day, yearly_month, yearlyByDay_weekOfMonth, yearlyByDay_day, yearlyByDay_month, selectedMonthMaxDays;
	var endAfterInstancesLimit = 999;

	$(".recurrence_div .errormsg").addClass("hidden").html("");

	if (validateScenario == "Add") {
		recurrenceType = $('#AddCalendarEventPopup input[name$="recurrence-list"]:checked').val();
		dailyRecurType = $('#AddCalendarEventPopup input[name$="dailyRecurType"]:checked').val();
		dailyRecurFrequency = $('#dailyRecurFrequency').val();
		weeklyRecurFrequency = $("#WeeklyFrequency").val();
		monthlyRecurType = $("#monthlyDiv input[name$='monthlyRecurType']:checked").val();
		monthlyDayOf = $("#monthlyDiv input[name$='monthlyDayOf']").val();
		monthFrequency = $("#monthlyDiv input[name$='monthFrequency']").val();
		monthlyByDay_monthFrequency = $("#monthlyDiv input[name$='monthlyByDay_monthFrequency']").val();
		yearly_month = $("#YearlyDiv select[name$='yearly_month']").val();
		yearlyRecurType = $("#YearlyDiv input[name$='yearlyRecurType']:checked").val();
		yearlyFrequency = $("#YearlyDiv input[name$='yearlyFrequency']").val();
		yearly_day = $("#YearlyDiv input[name$='yearly_day']").val();
		//Recurrence End Values from user Input
		RecurEndType = $('#AddCalendarEventPopup input[name="EndDateRangeType"]:checked').val();
		RecurEndAfterInstances = $('#EndafterInstances').val();
		RecurEndDate = (addEventData.EndDate instanceof Date) ? addEventData.EndDate : null;
	}
	else if (validateScenario == "Update") {
		recurrenceType = $('#EditCalendarEventPopup input[name$="recurrence-list"]:checked').val();
		dailyRecurType = $('#EditCalendarEventPopup input[name$="dailyRecurType"]:checked').val();
		dailyRecurFrequency = $('#EditDailyRecurFrequency').val();
		weeklyRecurFrequency = $("#EditWeeklyFrequency").val();
		monthlyRecurType = $("#EditmonthlyDiv input[name$='monthlyRecurType']:checked").val();
		monthlyDayOf = $("#EditmonthlyDiv input[name$='monthlyDayOf']").val();
		monthFrequency = $("#EditmonthlyDiv input[name$='monthFrequency']").val();
		monthlyByDay_monthFrequency = $("#EditmonthlyDiv input[name$='monthlyByDay_monthFrequency']").val();
		yearly_month = $("#EditYearlyDiv select[name$='yearly_month']").val();
		yearlyRecurType = $("#EditYearlyDiv input[name$='yearlyRecurType']:checked").val();
		yearlyFrequency = $("#EditYearlyDiv input[name$='yearlyFrequency']").val();
		yearly_day = $("#EditYearlyDiv input[name$='yearly_day']").val();
		//Recurrence End Values from user Input
		RecurEndType = $('#EditCalendarEventPopup input[name="EndDateRangeType"]:checked').val();
		RecurEndAfterInstances = $('#EditEndafterInstances').val();
		RecurEndDate = (addEventData.EndDate instanceof Date) ? addEventData.EndDate : null;
	}

	//ALL RECURR PATTERN Validations//
	if (recurrenceType == "daily") {
		if (dailyRecurType == "Every" && !dailyRecurFrequency) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please enter daily frequency and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (dailyRecurType == "Every" && (dailyRecurFrequency < 1 || dailyRecurFrequency > 255 || dailyRecurFrequency.indexOf(".") != -1)) {
			isValidEvent = false;
			eventValidationErrorMsg = "The number of days between recurrences of this event must be between 1 and 255.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (!dailyRecurType) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please choose daily pattern type and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
	}
	else if (recurrenceType == "weekly") {
		if (weeklyRecurFrequency && weeklyRecurFrequency < 1 || weeklyRecurFrequency > 255 || weeklyRecurFrequency.indexOf(".") != -1) {
			isValidEvent = false;
			eventValidationErrorMsg = "The number of days between recurrences of this event must be between 1 and 255.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (!weeklyRecurFrequency || (validateScenario == "Add" && $("#weeklyDiv input[type='checkbox']:checked").length == 0)) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please select days/frequency for weekly recurrence.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (!weeklyRecurFrequency || (validateScenario == "Update" && $("#EditweeklyDiv input[type='checkbox']:checked").length == 0)) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please select days/frequency for weekly recurrence.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
	}
	else if (recurrenceType == "monthly") {
		if (monthlyRecurType == "Day") {
			var momentValue = addEventData.EventDate instanceof Date ? addEventData.EventDate.getFullYear() + "-" + (addEventData.EventDate.getMonth() + 1) : "2020-01";
			selectedMonthMaxDays = moment(momentValue, "YYYY-MM").daysInMonth();
			//selectedMonthMaxDays = 31;
		}
		if (monthlyRecurType == "Day" && (!monthFrequency || !monthlyDayOf)) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please enter day/frequency for the monthly recurring pattern.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (monthlyRecurType == "Day" && (monthlyDayOf < 1 || monthlyDayOf > selectedMonthMaxDays || monthlyDayOf.indexOf(".") != -1)) {
			isValidEvent = false;
			eventValidationErrorMsg = "Day for the selected month must be between 1 and " + selectedMonthMaxDays + ".";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (monthlyRecurType == "Day" && (monthFrequency < 1 || monthFrequency > 12 || monthFrequency.indexOf(".") != -1)) {
			isValidEvent = false;
			eventValidationErrorMsg = "The number of months between recurrences must be between 1 and 12.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (monthlyRecurType == "The" && !monthlyByDay_monthFrequency) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please enter monthly frequency and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (monthlyRecurType == "The" && (monthlyByDay_monthFrequency < 1 || monthlyByDay_monthFrequency > 12 || monthlyByDay_monthFrequency.indexOf(".") != -1)) {
			isValidEvent = false;
			eventValidationErrorMsg = "The number of months between recurrences must be between 1 and 12.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (!monthlyRecurType) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please choose monthly pattern type and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
	}
	else if (recurrenceType == "yearly") {
		endAfterInstancesLimit = 99;
		if (yearlyRecurType == "On") {
			var momentValue = addEventData.EventDate instanceof Date ? addEventData.EventDate.getFullYear() + "-" + yearly_month : "2020-" + yearly_month;
			selectedMonthMaxDays = moment(momentValue, "YYYY-MM").daysInMonth();
		}

		if (!yearlyFrequency) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please enter yearly frequency and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (yearlyFrequency < 1 || yearlyFrequency > 3 || yearlyFrequency.indexOf(".") != -1) {
			isValidEvent = false;
			eventValidationErrorMsg = "The number of years between recurrences must be 1 and 3.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (yearlyRecurType == "On" && !yearly_day) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please enter day for selected month and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (yearlyRecurType == "On" && (yearly_day > selectedMonthMaxDays || yearly_day < 1 || yearly_day.indexOf(".") != -1)) {
			isValidEvent = false;
			eventValidationErrorMsg = "Day for the selected month must be between 1 and " + selectedMonthMaxDays + ".";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
		else if (!yearlyRecurType) {
			isValidEvent = false;
			eventValidationErrorMsg = "Please choose yearly pattern type and try again.";
			$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
		}
	} else if (!recurrenceType) {
		isValidEvent = false;
		eventValidationErrorMsg = "Please select recurrence type and try again.";
		$("#" + id + "dailyDiv").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	//RANGE of RECURRENCE Validations//
	var isValidDates = (addEventData.EventDate && addEventData.EndDate) ? true : false;
	var eleStartDateId = (validateScenario == "Add") ? "windowStart_windowStartDate" : "EditwindowStart_windowStartDate";
	var eleEndDateId = (validateScenario == "Add") ? "windowEnd_windowEndDate" : "EditwindowEnd_windowEndDate";

	if (RecurEndType == "Endafter" && !RecurEndAfterInstances) {
		isValidEvent = false;
		eventValidationErrorMsg = "Please enter end after occurrences and try again.";
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	else if (RecurEndType == "Endafter" && (RecurEndAfterInstances < 1 || RecurEndAfterInstances > endAfterInstancesLimit || RecurEndAfterInstances.indexOf(".") != -1)) {
		isValidEvent = false;
		eventValidationErrorMsg = "The number of times this event recurs must be between 1 and " + endAfterInstancesLimit;
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	else if (RecurEndType == "Endby" && !RecurEndDate) {
		isValidEvent = false;
		eventValidationErrorMsg = "Please select end by date for range of recurrence.";
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	else if (RecurEndType == "Endby" && RecurEndDate && !validateInputDateFormats($("#" + eleEndDateId).val())) {
		isValidEvent = false;
		eventValidationErrorMsg = "Invalid end date.";
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	else if (!RecurEndType) {
		isValidEvent = false;
		eventValidationErrorMsg = "Please select recurrence end type and try again.";
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	if (!addEventData.EventDate) {
		eventValidationErrorMsg = "Please select start date for range of recurrence.";
		isValidDates = false;
		isValidEvent = false;
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	} else if ((addEventData.EventDate && !validateInputDateFormats($("#" + eleStartDateId).val()) || (addEventData.EndDate && !validateInputDateFormats($("#" + eleEndDateId).val())))) {
		eventValidationErrorMsg = "Invalid date.";
		isValidDates = false;
		isValidEvent = false;
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	if (isValidDates && addEventData.EventDate.getTime() == addEventData.EndDate.getTime()) {
		eventValidationErrorMsg = "Start Time and End Time cannot be same.";
		isValidEvent = false;
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	if (isValidDates && addEventData.EventDate.toLocaleDateString() == addEventData.EndDate.toLocaleDateString() && addEventData.EventDate.getTime() > addEventData.EndDate.getTime()) {
		eventValidationErrorMsg = "Start Time cannot be greater than End Time.";
		isValidEvent = false;
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}
	if (isValidDates && (addEventData.EventDate < new Date() || addEventData.EndDate < new Date())) {
		eventValidationErrorMsg = "Event cannot be created in the past.";
		isValidEvent = false;
		$("#" + id + "windowStart_windowStartDate").closest('fieldset').siblings(".errormsg").removeClass("hidden").html(eventValidationErrorMsg);
	}

	return isValidEvent;
}

////// Drag/Choose Event Handlers and building Files array Starts Here //////

var eventAttachmentsArray = [];
var deletedAttachmentArray = [];
var counter = 0;

function dragOverHandlerCal(event) {
	event.preventDefault();
}

function dropHandlerCal(element, event) {
	event.preventDefault();
	counter = 0;
	$('.dropzone').removeClass("activeDrop");
	fileSelectCal(element, event);
}

function enterZoneCal(elem) {
	counter++;
	console.log("counter =" + counter);
	$(elem).addClass("activeDrop");
}

function leaveZoneCal(elem) {
	counter--;
	console.log("counter =" + counter);
	if (counter == 0) {
		$(elem).removeClass("activeDrop");
	}
}

function fileSelectCal(element, evt) {
	var attachdiv = "";
	var errormsg = "";
	var files = evt.target.files;
	if (!files) {
		files = evt.dataTransfer.files;
	}
	files = $.makeArray(files);
	if (files.length > 0) {
		$.each(files, function (index, value) {
			var fname = value.name;
			var match = (new RegExp("['~#%\&{}+\|]|\\.\\.|^\\.|\\.$")).test(fname);
			if (match || fname.indexOf('"') > -1) {
				errormsg = "Selected file already exists or contains invalid characters.";
			} else if (checkIfIsDupAttachment(fname)) {
				errormsg = "Selected file already exists or contains invalid characters.";
			} else if (value.size == 0) {
				errormsg = "Please upload valid file(s).";
			} else if (checkEventFileExtentions(fname)) {
				eventAttachmentsArray.push(value);
				attachdiv += '<li><a href="javascript:void(0);" title="' + fname + '" class="attchfile mt2">' + fname + ' </a><a href="javascript:void(0);"  onclick="removeAttachment(this,\'' + fname + '\');" onkeypress="removeAttachment(this,\'' + fname + '\');" title="Close"><i class="icon-calendarclose"></i></a></li>';
			} else {
				errormsg = "Selected file already exists or contains invalid characters.";
			}
		});
		$(".eventAttachementsErrormsg").html(errormsg).show();

		if ($(element).closest(".event-attachment").find(".attachmentsdisplay ul").length > 0) {
			$(element).closest(".event-attachment").find(".attachmentsdisplay ul").append(attachdiv);
		} else {
			$(element).closest(".event-attachment").find(".attachmentsdisplay").append("<ul>" + attachdiv + "</ul>");
		}
		//$(element).closest(".event-attachment").find(".attachmentsdisplay").append(attachdiv);
		$("#calEvent_attachFile, #calEvent_attachFileEdit").val('');
	}
}

function checkIfIsDupAttachment(fname) {
	var isDup = false;
	eventAttachmentsArray.forEach(function (file) {
		if (file.name == fname) {
			isDup = true;
		}
	});
	//For Edit Popup Atachments
	if ($("#EditCalendarEventPopup").is(":visible")) {
		$("#eventAttachementsEdit ul li").each(function () {
			if ($(this).find('a').attr("title") == fname) {
				isDup = true;
			}
		});
	}
	return isDup;
}

function removeAttachment(element, filename) {
	$(element).closest("li").remove();
	$.each(eventAttachmentsArray, function (index, value) {
		if (value.name == filename) {
			eventAttachmentsArray.splice(index, 1);
			return false;
		}
	});
}

function removeEditAttachment(element, filename) {
	if (confirm(" Are you sure, you want to delete the selected attachment from the event")) {
		$(element).closest("li").remove();
		deletedAttachmentArray.push(filename);
	}
}
///////

function decodeRecurringXML(eventData) { //// Returns user readable recurring info from recurring XML ////
	var userRecurrenceOutput = '';
	var recurrencexmlvalue = JSON.parse(convertXml2JSon(eventData.RecurrenceData));
	var eventStartDate = (!eventData.fAllDayEvent ? new Date(eventData.EventDate).format("MM/dd/yyyy") : formDateObjectWithouTZ(eventData.EventDate).format("MM/dd/yyyy"));
	var eventEndDate = (!eventData.fAllDayEvent ? new Date(eventData.EndDate).format("MM/dd/yyyy") : formDateObjectWithouTZ(eventData.EndDate).format("MM/dd/yyyy"));
	var eventStartTime = (!eventData.fAllDayEvent ? new Date(eventData.EventDate).format("hh:mm tt") : formDateObjectWithouTZ(eventData.EventDate).format("hh:mm tt"));
	var eventEndTime = (!eventData.fAllDayEvent ? new Date(eventData.EndDate).format("hh:mm tt") : formDateObjectWithouTZ(eventData.EndDate).format("hh:mm tt"));

	if (recurrencexmlvalue) {
		var recurrenceType = recurrencexmlvalue.recurrence.rule.repeat;
		if (recurrenceType.daily && recurrenceType.daily._weekday) {
			userRecurrenceOutput = "Occurs every weekday effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
		}
		else if (recurrenceType.daily) {
			userRecurrenceOutput = "Occurs every " + recurrenceType.daily._dayFrequency + " day(s) effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
		}
		else if (recurrenceType.weekly) {
			userRecurrenceOutput = "Occurs every " + getWeeklyPattern(recurrenceType.weekly, "weekly") + " effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
		}
		else if (recurrenceType.monthly && recurrenceType.monthly._day && recurrenceType.monthly._monthFrequency) {
			userRecurrenceOutput = "Occurs day " + recurrenceType.monthly._day + " of every " + recurrenceType.monthly._monthFrequency + "  month(s) effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
		}
		else if (recurrenceType.monthlyByDay && recurrenceType.monthlyByDay._monthFrequency && recurrenceType.monthlyByDay._monthFrequency) {
			userRecurrenceOutput = "Occurs the " + recurrenceType.monthlyByDay._weekdayOfMonth + " " + getWeeklyPattern(recurrenceType.monthlyByDay, "monthly") + " of every " + recurrenceType.monthlyByDay._monthFrequency + "  month(s) effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
		}
		else if (recurrenceType.yearly) {
			userRecurrenceOutput = "Occurs every " + moment(recurrenceType.yearly._month, 'MM').format('MMMM') + " " + recurrenceType.yearly._day + " effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
		}
		else if (recurrenceType.yearlyByDay) {
			if (recurrenceType.yearlyByDay._yearFrequency == 1) {
				userRecurrenceOutput = "Occurs the " + recurrenceType.yearlyByDay._weekdayOfMonth + " " + getWeeklyPattern(recurrenceType.yearlyByDay, "yearly") + " of " + moment(recurrenceType.yearlyByDay._month, 'MM').format('MMMM') + " effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
			} else {
				userRecurrenceOutput = "Occurs every " + recurrenceType.yearlyByDay._yearFrequency + " years on the " + recurrenceType.yearlyByDay._weekdayOfMonth + " " + getWeeklyPattern(recurrenceType.yearlyByDay, "yearly") + " of " + moment(recurrenceType.yearlyByDay._month, 'MM').format('MMMM') + " effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
			}
		}
	} else {
		userRecurrenceOutput = "Occurs every weekday effective " + eventStartDate + " until " + eventEndDate + " from " + eventStartTime + " to " + eventEndTime + ".";
	}

	return userRecurrenceOutput;
}

function getWeeklyPattern(RecurrenceData, recurType) {
	var weekDaysText = "";
	if (RecurrenceData._su) {
		weekDaysText += "Sunday,";
	}
	if (RecurrenceData._mo) {
		weekDaysText += "Monday,";
	}
	if (RecurrenceData._tu) {
		weekDaysText += "Tuesday,";
	}
	if (RecurrenceData._we) {
		weekDaysText += "Wednesday,";
	}
	if (RecurrenceData._th) {
		weekDaysText += "Thursday,";
	}
	if (RecurrenceData._fr) {
		weekDaysText += "Friday,";
	}
	if (RecurrenceData._sa) {
		weekDaysText += "Saturday,";
	}
	if (recurType != "weekly") {
		weekDaysText = weekDaysText.replace(",", "");
	}
	return weekDaysText;
}

function prePopRecurrenceValues(eventItem) { //// Prepopulating Form Values for recurring events from XML data by parsing it to JSON ////

	$(".recurrence-event").show();
	$("#EditEventStartDate, #EditEventStartDateIcon	, #EditEventEndDate, #EditEventEndDateIcon").hide();
	$('#EditCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px');
	$('#EditCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '0px');

	$("#EditwindowStart_windowStartDate").val(getEventDate(eventItem.EventDate, eventItem.fAllDayEvent));

	var RecurrenceData = eventItem.RecurrenceData;
	var recurrencexmlvalue = JSON.parse(convertXml2JSon(RecurrenceData));
	if (recurrencexmlvalue) {
		$.each(recurrencexmlvalue.recurrence.rule.repeat, function (key, value) {
			//recurrence = key;
		});
	} else {
		recurrencexmlvalue = customJSONParser(RecurrenceData);
	}

	if (RecurrenceData) {
		if (RecurrenceData.indexOf("<repeat><daily") != -1) {
			$("#EditDaily").trigger("click");
			if (RecurrenceData.indexOf("<repeat><daily weekday='TRUE'") != -1 || RecurrenceData.indexOf('<repeat><daily weekday="TRUE"') != -1) {
				$("#EditEveryWeekday").prop("checked", true);
			} else if (RecurrenceData.indexOf("<repeat><daily dayFrequency=") != -1) {
				$("#EditDailyRecurEvery").prop("checked", true);
				$("#EditDailyRecurFrequency").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.daily._dayFrequency.replace(/[^a-z0-9\s]/gi, '')));
			}
		}
		else if (RecurrenceData.indexOf("<repeat><weekly") != -1) {
			$("#EditWeekly").trigger("click");
			$("#EditWeeklyFrequency").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.weekly._weekFrequency.replace(/[^a-z0-9\s]/gi, '')));
			//Using simple index of to check weekly recurring checkbox values
			if (RecurrenceData.indexOf('su="TRUE"') != -1 || RecurrenceData.indexOf("su='TRUE'") != -1) {
				$("#EditSunday").prop("checked", true);
			}
			if (RecurrenceData.indexOf('mo="TRUE"') != -1 || RecurrenceData.indexOf("mo='TRUE'") != -1) {
				$("#EditMonday").prop("checked", true);
			}
			if (RecurrenceData.indexOf('tu="TRUE"') != -1 || RecurrenceData.indexOf("tu='TRUE'") != -1) {
				$("#EditTuesday").prop("checked", true);
			}
			if (RecurrenceData.indexOf('we="TRUE"') != -1 || RecurrenceData.indexOf("we='TRUE'") != -1) {
				$("#EditWednesday").prop("checked", true);
			}
			if (RecurrenceData.indexOf('th="TRUE"') != -1 || RecurrenceData.indexOf("th='TRUE'") != -1) {
				$("#EditThursday").prop("checked", true);
			}
			if (RecurrenceData.indexOf('fr="TRUE"') != -1 || RecurrenceData.indexOf("fr='TRUE'") != -1) {
				$("#EditFriday").prop("checked", true);
			}
			if (RecurrenceData.indexOf('sa="TRUE"') != -1 || RecurrenceData.indexOf("sa='TRUE'") != -1) {
				$("#EditSaturday").prop("checked", true);
			}
		} else if (RecurrenceData.indexOf("<repeat><monthly") != -1) {
			$("#EditMonthly").trigger("click");
			if (RecurrenceData.indexOf('day="') != -1 || RecurrenceData.indexOf("day='") != -1) {
				$("#EditmonthlyDiv input[value$='Day']").prop("checked", true);
				$("#EditmonthlyDiv input[name$='monthlyDayOf']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.monthly._day.replace(/[^a-z0-9\s]/gi, '')));
				$("#EditmonthlyDiv input[name='monthFrequency']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.monthly._monthFrequency.replace(/[^a-z0-9\s]/gi, '')));
			}
			else if (RecurrenceData.indexOf('<repeat><monthlyByDay') != -1) {
				$("#EditmonthlyDiv input[value$='The']").prop("checked", true);

				if (RecurrenceData.indexOf('su="TRUE"') != -1 || RecurrenceData.indexOf("su='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("su");
				}
				if (RecurrenceData.indexOf('mo="TRUE"') != -1 || RecurrenceData.indexOf("mo='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("mo");
				}
				if (RecurrenceData.indexOf('tu="TRUE"') != -1 || RecurrenceData.indexOf("tu='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("tu");
				}
				if (RecurrenceData.indexOf('we="TRUE"') != -1 || RecurrenceData.indexOf("we='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("we");
				}
				if (RecurrenceData.indexOf('th="TRUE"') != -1 || RecurrenceData.indexOf("th='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("th");
				}
				if (RecurrenceData.indexOf('fr="TRUE"') != -1 || RecurrenceData.indexOf("fr='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("fr");
				}
				if (RecurrenceData.indexOf('sa="TRUE"') != -1 || RecurrenceData.indexOf("sa='TRUE'") != -1) {
					$("#EditmonthlyDiv select[name$='monthlyByDay_day']").val("sa");
				}
				$("#EditmonthlyDiv select[name$='monthlyByDay_weekOfMonth']").val(recurrencexmlvalue.recurrence.rule.repeat.monthlyByDay._weekdayOfMonth);
				$("#EditmonthlyDiv input[name$='monthlyByDay_monthFrequency']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.monthlyByDay._monthFrequency.replace(/[^a-z0-9\s]/gi, '')));
			}
		} else if (RecurrenceData.indexOf("<repeat><yearly") != -1) {
			$("#EditYearly").trigger("click");
			if (RecurrenceData.indexOf('day="') != -1 || RecurrenceData.indexOf("day='") != -1) {
				$("#EditYearlyDiv input[value='On']").prop("checked", true);
				$("#EditYearlyDiv input[name$='yearly_day']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.yearly._day.replace(/[^a-z0-9\s]/gi, '')));
				$("#EditYearlyDiv select[name$='yearly_month']").val(recurrencexmlvalue.recurrence.rule.repeat.yearly._month);
				$("#EditYearlyDiv input[name='yearlyFrequency']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.yearly._yearFrequency.replace(/[^a-z0-9\s]/gi, '')));
			}
			else if (RecurrenceData.indexOf('<repeat><yearlyByDay') != -1) {
				$("#EditYearlyDiv input[value$='Onthe']").prop("checked", true);
				$("#EditYearlyDiv select[name$='yearlyByDay_weekOfMonth']").val(recurrencexmlvalue.recurrence.rule.repeat.yearlyByDay._weekdayOfMonth);
				$("#EditYearlyDiv select[name$='yearlyByDay_month']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.yearlyByDay._month));
				$("#EditYearlyDiv input[name='yearlyFrequency']").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeat.yearlyByDay._yearFrequency.replace(/[^a-z0-9\s]/gi, '')));

				if (RecurrenceData.indexOf('su="TRUE"') != -1 || RecurrenceData.indexOf("su='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("su");
				}
				if (RecurrenceData.indexOf('mo="TRUE"') != -1 || RecurrenceData.indexOf("mo='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("mo");
				}
				if (RecurrenceData.indexOf('tu="TRUE"') != -1 || RecurrenceData.indexOf("tu='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("tu");
				}
				if (RecurrenceData.indexOf('we="TRUE"') != -1 || RecurrenceData.indexOf("we='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("we");
				}
				if (RecurrenceData.indexOf('th="TRUE"') != -1 || RecurrenceData.indexOf("th='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("th");
				}
				if (RecurrenceData.indexOf('fr="TRUE"') != -1 || RecurrenceData.indexOf("fr='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("fr");
				}
				if (RecurrenceData.indexOf('sa="TRUE"') != -1 || RecurrenceData.indexOf("sa='TRUE'") != -1) {
					$("#EditYearlyDiv select[name$='yearlyByDay_day']").val("sa");
				}
			}
		}
	}
	//For Range of recurrence Values
	if (RecurrenceData.indexOf('<repeatForever>FALSE</repeatForever>') != -1) {
		$("#EditNoenddate").prop("checked", true);
	} else if (RecurrenceData.indexOf("</repeatInstances></rule></recurrence>") != -1) {
		$("#EditEndafter").prop("checked", true);
		$("#EditEndafterInstances").val(JSON.parse(recurrencexmlvalue.recurrence.rule.repeatInstances.replace(/[^a-z0-9\s]/gi, '')));
	} else {
		$("#EditEndby").prop("checked", true);
		$("#EditwindowEnd_windowEndDate").val(getEventDate(eventItem.EndDate, eventItem.fAllDayEvent));
	}
}

function resetAddEventValues() { ////// Resets Calendar ADD Popup's Previous Values //////
	$('.addEventVal').val('');
	$(".addEventProp").prop("checked", false);
	$(".eventPopup input[type=number]").val("");
	$(".eventPopup input[type=radio], .eventPopup input[type=checkbox]").prop("checked", false);
	$(".eventPopup .errormsg").addClass("hidden").html("");
	$(".recurrence-event").hide();
	$("#Daily").trigger("click");

	$('#AddEventStartHours, #AddEventEndHours, #AddEventStartMins, #AddEventEndMins').prop("selectedIndex", 0);
	$("#AddEventStartHours,#AddEventStartMins,#AddEventEndHours,#AddEventEndMins").prop("disabled", false);

	$("#AddEventStartDate,#AddEventStartDateIcon,#AddEventEndDate,#AddEventEndDateIcon").show();
	$('#AddCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px 10px -5px 0px');
	$('#AddCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '10px');

	$("#AddCalendarEventPopup").closest(".attUpload").val('');
	$("#AddCalendarEventPopup").closest(".dropzone").removeClass('activeDrop');
	$('.eventAttachementsErrormsg').text('').hide();
	$("#eventAttachements ul").html('');
	eventAttachmentsArray = [];
	$('#AddAssignedComponent').val("");
	$('#AddCspCategory').val("");
	categoryhtml = bindCategoriesAdd();
	if (!categoryhtml) {
		localStorage.setItem("CSPCategory_" + sitename, JSON.stringify(allcategories));
		categoryhtml = bindCategoriesAdd();
	}
	if (isCPTSCatOwner || isCPTSOwner) {
		CPTS = cptsForSettings;
		MAJCOM = majcomForSettings;
		if((majcomForSettings==ANG_MAJCOM)){
			$("#AddAssignedComponent").html("<option value='ANG'>Air National Guard </option>");
			}
		else if(majcomForSettings==AFRC_MAJCOM){
			$("#AddAssignedComponent").html("<option value='AFRC'>Air Force Reserve Command </option>");
		}
		else{
			$("#AddAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
		}
	} else if (isMAJCOMOwners) {
		CPTS = "ALL";
		MAJCOM = majcomForSettings;
		if((majcomForSettings==ANG_MAJCOM)){
			$("#AddAssignedComponent").html("<option value='ANG'>Air National Guard </option>");
			}
		else if(majcomForSettings==AFRC_MAJCOM){
			$("#AddAssignedComponent").html("<option value='AFRC'>Air Force Reserve Command </option>");
		}
		else{
			$("#AddAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
		}
	}else if(isAFIMSCOwner){
		CPTS = "ALL";
		MAJCOM = "ALL";
		$("#AddAssignedComponent").html("<option value='RegAF'>Regular Air Force</option>");
	}
	else if(isAFFSCOwner){
		CPTS = "ALL";
		MAJCOM = "ALL";
		$("#AddAssignedComponent").html("<option value=''>Select</option>");
		$("#AddAssignedComponent").append("<option value='RegAF'>Regular Air Force</option>");
		$("#AddAssignedComponent").append("<option value='AFRC'>Air Force Reserve Command</option>");
	}
	else {
		CPTS = "ALL";
		MAJCOM = "ALL";
		$('#AddAssignedComponent').html(AssignedComponenthtml);
	}
	$('#AddCspCategory').html(categoryhtml);
	$("#AddCalendarEventPopup .fs-label").html("Select Categories")
	$("#AddCalendarEventPopup .fs-option").each(function () {
		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
	});
	$('#AddCspCategory').fSelect();
	isFormValueChangesMade = false;

	$("#AddCategoryUsersValue").prop("disabled", true);
}

function resetEditEventValues() { ////// Resets Calendar EDIT Popup's Previous Values //////
	$('.editEventVal').val('');
	$(".editEventProp").prop("checked", false);
	$(".eventPopup input[type=radio], .eventPopup input[type=checkbox]").prop("checked", false);
	$(".eventPopup input[type=number]").val("");
	$("#EditDaily").trigger("click");
	$(".eventPopup .errormsg").addClass("hidden").html("");

	$(".recurrence-event").hide();
	$('#EditEventStartHours, #EditEventEndHours, #EditEventStartMins, #EditEventEndMins').prop("selectedIndex", 0);;
	$(".editEventVal, .editEventProp").prop("disabled", true);
	$(".editEventVal, .editEventProp").addClass("hide-element");
	$("#EditCalendarEventPopup .category-select").addClass("disabled");
	$("#EditCalendarEventPopup .AssignedComponent").addClass("disabled");
	$("#EditEventStartHours,#EditEventStartMins,#EditEventEndHours,#EditEventEndMins").prop("disabled", true);

	$("#EditEventStartDate,#EditEventStartDateIcon,#EditEventEndDate,#EditEventEndDateIcon").show();
	$('#EditCalendarEventPopup .date-time-forms .item:first-child').css('margin', '0px 10px -5px 0px');
	$('#EditCalendarEventPopup .date-time-forms .item:nth-child(2)').css('margin-left', '10px');
	$('#EditEventStartDateIcon, #EditEventEndDateIcon').attr("title", "");
	$('#EditEventStartDateIcon, #EditEventEndDateIcon').css("cursor", "default");

	$("#EventAttachmentsView, #EditRecurrenceView").removeClass('hidden');
	$("#eventAttachementsEditDiv, #EditRecurrenceEdit").addClass('hidden');
	$("#UpdateEvent, #EditCalendarEventPopup .cancelEventBtn").hide();
	$("#DeleteEvent, .prev-next-btns").show();
	$("#editEvent").show();
	$("#EventAttachmentsView #EditRecurrenceView span").html("");
	$("#eventAttachementsEdit").html("");
	$('.eventAttachementsErrormsg').text('').hide();
	deletedAttachmentArray = [];
	eventAttachmentsArray = [];
	categoryhtml = bindCategoriesAdd();
	if (!categoryhtml) {
		localStorage.setItem("CSPCategory_" + sitename, JSON.stringify(allcategories));
		categoryhtml = bindCategoriesAdd();
	}
	$('#EditCspCategory').html(categoryhtml);
	$('#EditAssignedComponent').html(AssignedComponenthtml);
	if (isCPTSCatOwner || isCPTSOwner) {
        if((majcomForSettings==ANG_MAJCOM)){
            $('#EditAssignedComponent').html("<option value='ANG'>Air National Guard </option>");
            }
        else if(majcomForSettings==AFRC_MAJCOM){
            $('#EditAssignedComponent').html("<option value='AFRC'>Air Force Reserve Command </option>");
        }
        else{
            $('#EditAssignedComponent').html("<option value='RegAF'>Regular Air Force</option>");
         
        }
    } else if (isMAJCOMOwners) {
        if((majcomForSettings==ANG_MAJCOM)){
            $('#EditAssignedComponent').html("<option value='ANG'>Air National Guard </option>");
            }
        else if(majcomForSettings==AFRC_MAJCOM){
            $('#EditAssignedComponent').html("<option value='AFRC'>Air Force Reserve Command </option>");
        }
        else{
            $('#EditAssignedComponent').html("<option value='RegAF'>Regular Air Force</option>");
        }
    } else { 
        if(isAFIMSCOwner){
            $('#EditAssignedComponent').html("<option value='RegAF'>Regular Air Force</option>");
        }else if(isAFFSCOwner){
			$("#EditAssignedComponent").html("<option value=''>Select</option>");
			$("#EditAssignedComponent").append("<option value='RegAF'>Regular Air Force</option>");
			$("#EditAssignedComponent").append("<option value='AFRC'>Air Force Reserve Command</option>");
		}
		else{
        $('#EditAssignedComponent').html(AssignedComponenthtml);
        }
    } 
	$("#EditCalendarEventPopup .fs-label").html("Select Categories")
	$("#EditCalendarEventPopup .fs-option").each(function () {
		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
	});
	$('#EditCspCategory').fSelect();
	isFormValueChangesMade = false;
}

//// Calendar Common Functions Starts Here ////

function createGuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function convertDates(x, formatter) {
	var createdDate = '';
	if (x != '' && x != 'null' && x != undefined) {
		var dt = new Date(x);
		createdDate = dt.format('MM/dd/yyyy hh:mm tt');
		if (formatter == "date") {
			createdDate = dt.format('MM/dd/yyyy hh:mm tt'); //hh:mm tt
		}
	}
	return createdDate;
}

function checkEventFileExtentions(val) {
	var regex = new RegExp("(.*?)\.(txt|xlsx|xls|doc|docx|ppt|pptx|pdf|png|jpg|jpeg|XLSX|XLS|DOC|DOCX|PPT|PPTX|PDF|PNG|JPG|JPEG|TXT)$");
	if (!(regex.test(val))) {
		return false;
	} else {
		return true;
	}
}

function customJSONParser(RecurrenceData) {
	var recurrencexmlvalue = {};
	recurrencexmlvalue = { recurrence: { rule: { repeatInstances: $(RecurrenceData).find('repeatInstances').text() } } };
	return recurrencexmlvalue;
}

function convertXml2JSon(Recurrence) {
	var x2js = new X2JS();
	var data = Recurrence;
	return JSON.stringify(x2js.xml_str2json(data));
}

function makeElementDraggable(elementId) {
	$(elementId).draggable();
	$(elementId).css('top', 'initial');
	$(elementId).css('left', 'inherit');
}

function chooseFileOnEnter(event, element) {
	if (event.which == 13) {
		$(element).click();
	}
}

function validateInputDateFormats(inputDate) {
	var isValidDate = false;
	if (inputDate) {
		inputDate = inputDate.split("/");
		if (inputDate.length == 3) {
			isValidDate = (inputDate[0] <= 12 && inputDate[1] <= 31 && inputDate[2].length == 4) ? true : false;
		}
	} else {
		isValidDate = true;
	}
	return isValidDate;
}

function formDateforEvent(eventDate, eventHours, eventMins, startOrEnd, allDayEvent) {
	var completeDate = null;
	var formedDate;
	var numberOfDaysToAdd = 1;
	if (allDayEvent) {
		eventDate = eventDate.split("/");
		if (eventDate.length == 3) {
			eventDate = eventDate[2] + "-" + eventDate[0] + "-" + eventDate[1];
			if (startOrEnd == "StartDate") {
				formedDate = eventDate + "T00:00:00";
				completeDate = new Date(formedDate);
				completeDate.setDate(completeDate.getDate() + numberOfDaysToAdd);
			} else if (startOrEnd == "EndDate") {
				formedDate = eventDate + "T23:59:00";
				completeDate = new Date(formedDate);
			}
		}
	} else {
		eventDate = eventDate.split("/");
		if (eventDate.length == 3) {
			eventDate = eventDate[2] + "-" + eventDate[0] + "-" + eventDate[1];
			eventHours = eventHours.split(" ");
			formedDate = eventDate + "T" + eventHours[0] + ":" + eventMins + ":00";
			completeDate = new Date(formedDate);
		}
	}
	return completeDate;
}

function getEventDate(eventDate, isAllDay) {
	var finalDate = '';
	if (isAllDay && !(eventDate instanceof Date)) {
		eventDate = new Date(eventDate.replace(/[TZ]/g, " "));
		finalDate = eventDate.format("MM/dd/yyyy");
	}
	else {
		eventDate = new Date(eventDate);
		finalDate = eventDate.format("MM/dd/yyyy");
	}
	return finalDate;
}

function getEventHours(eventHours) {
	var finalHours = '';
	if (eventHours) {
		eventHours = new Date(eventHours);
		finalHours = eventHours.getHours().toString();
		finalHours = (finalHours > 9) ? finalHours : "0" + finalHours;
		finalHours = (finalHours >= 12) ? finalHours + " PM" : finalHours + " AM";
	}
	return finalHours;
}

function getEventMins(eventMins) {
	var finalMins = '';
	if (eventMins) {
		eventMins = new Date(eventMins);
		finalMins = eventMins.getMinutes().toString();
		finalMins = (finalMins > 9) ? finalMins : "0" + finalMins;
	}
	return finalMins;
}

function getDayWithinTheWeekFromDate(weekDate, getWeekDay) {
	var weekByDate = weekDate;
	var diff = weekByDate.getDay() - getWeekDay;
	if (diff > 0) {
		weekByDate.setDate(weekByDate.getDate() - diff);
	}
	else if (diff < 0) {
		weekByDate.setDate(weekByDate.getDate() + ((-1) * diff))
	};
	return weekByDate;
}

function nthWeekdayOfMonth(weekday, n, date) {
	var date = new Date(date.getFullYear(), date.getMonth(), 1),
		add = (weekday - date.getDay() + 7) % 7 + (n - 1) * 7;
	date.setDate(1 + add);
	return date;
}

function getLastOccurence(weekday, date) {
	var day, month, year, counter;
	day = 1;
	year = date.getFullYear();
	month = date.getMonth();
	counter = 0;
	date = new Date(year, month, day);
	while (date.getMonth() === month) {
		if (date.getDay() === weekday) { // Sun=0, Mon=1, Tue=2, etc.
			counter += 1;
		}
		day += 1;
		date = new Date(year, month, day);
	}
	return counter;
}

function formDateObjectWithouTZ(userDate) {
	if (!(userDate instanceof Date)) {
		userDate = userDate.replace(/[TZ]/g, " ");
		return new Date(userDate);
	} else {
		return userDate;
	}
}

function setPluginAttributes() {
	$("#divcalendarcomponent .fc-prev-button").attr("title", "Previous");
	$("#divcalendarcomponent .fc-next-button").attr("title", "Next");
	$("#divcalendarcomponent .fc-timeGridDay-button").attr("title", "Day");
	$("#divcalendarcomponent .fc-timeGridWeek-button").attr("title", "Week");
	$("#divcalendarcomponent .fc-dayGridMonth-button").attr("title", "Month");
}

function filterNullOrUndefined(value) {
	if (value) {
		return value;
	} else {
		return "";
	}
}

function erroruploaddata(ErrorMessage) {
	alert(ErrorMessage);
	$('#pageoverlay').addClass('hidden');
}

/////////

$('.eventPopup').on('click keydown', function (e) { ////// Fix for fSelect Tab Ordering Issue //////
	var code = e.keyCode || e.which;
	if (!($(e.target).is('.fs-search input,.fs-option,.fs-label,.fs-option-label,.fs-checkbox,.fs-arrow,.fs-checkbox i,.fs-option')) && code != 40 && code != 38) {
		$('.fs-dropdown').addClass("hidden");
		$('.fs-wrap.multiple').removeClass('fs-open');
	}
	$(window).keyup(function (e) {
		var code = e.keyCode || e.which;
		if (code == 9) {
			$('.fs-dropdown').addClass("hidden");
			$('.fs-wrap.multiple').removeClass('fs-open');
		}
	});
});
