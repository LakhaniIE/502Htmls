////////////////////////   CALENDAR COMPONENT INNERVIEW JS  //////////////////////

//// Global Variables Declaration Starts Here /////

var spURL = window.location.protocol + '//' + window.location.hostname + _spPageContextInfo.webServerRelativeUrl;
var pnpWeb = new $pnp.Web(spURL);
var allEventsMap = new Map();
var allEventsData = [];
var allEventsFilteredData = [];
var allcategories = [];
var eventsData = [];
var categoryhtml = "";
var serviceBaseCPTS = "";
var categoryVal = "";
var CPTSMultiQuery = "";
var MajcomMultiQuery = "";
var calendarMain;
var calendarElement = document.getElementById("divcalendarcomponent");
var calendarListName = "CSPCalendar";
var categorylist = "CategoriesMetadata";

//// Global Variables Declaration Ends Here /////

//// Indexed DB Initialization Starts Here /////

var IndexedDBName = _spPageContextInfo.webId + "{" + _spPageContextInfo.userId + "}";
var IndexedDBVersion = 1;
var IndexedDBPromise = $.Deferred();
var IndexedDBObjStores = [calendarListName];
var IndexedDB = new IndexedDBModule();
IndexedDB.initIndexedDb(IndexedDBName, IndexedDBVersion, IndexedDBObjStores, IndexedDBPromise);

//// Indexed DB Initialization Ends Here /////

$(document).ready(function () { //// Binding Calendar Events when document gets ready /////
	$(".feedback").removeClass("hidden");
	$("#pageoverlay").removeClass("hidden");
	registerCalendarEvents();
});
buildversiondate_d.then(function () {
    JSRequest.EnsureSetup(); 
    $("#pageoverlay").removeClass("hidden");
    $.when(buildDropdowns_d).done(function () {
        $("#ddlMajcom").val(UserMajcom);
        $("#ddlAssignedComponent").val(ProfileUserAssignedComponent);
        $("#ddlServicingCPTS").val(UserCPTS);
        selectedComponent=$("#ddlAssignedComponent").val();
        serviceBaseCPTS = $("#ddlServicingCPTS").val();
        categoryVal = $("#ddlCategory").val();
        MajcomVal = $("#ddlMajcom").val();
		displayCalendar();
        $('#pageoverlay').addClass('hidden');
    });
});

$(document).on("change","#ddlAssignedComponent",function(){
    selectedComponent = $("#ddlAssignedComponent").val();
    if(selectedComponent=="AFRC") {
        $("#ddlMajcom").html(afrcMajcomOption);
        buildAFRCFM();
    } else if(selectedComponent=="ANG") {
        $("#ddlMajcom").html(angMajcomOption);
        buildANGCPTF();
    }else{
        buildMajcom();
        buildCPTS();
    }
    serviceBaseCPTS = $("#ddlServicingCPTS").val();
    MajcomVal = $("#ddlMajcom").val();
    categoryVal = $("#ddlCategory").val();
	allEventsFilteredData = filterUserInnerViewData(allEventsData);
	var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
	var activeDate = calendarMain.getDate();
	displayCalendar();
	calendarMain.gotoDate(activeDate);
	$("." + activeView).trigger('click');
});

$(document).on("change", "#ddlMajcom", function () {
    getMajcomCPTSCascadingValues();
    serviceBaseCPTS = $("#ddlServicingCPTS").val();
    MajcomVal = $("#ddlMajcom").val();
    categoryVal = $("#ddlCategory").val();
	allEventsFilteredData = filterUserInnerViewData(allEventsData);
	var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
	var activeDate = calendarMain.getDate();
	displayCalendar();
	calendarMain.gotoDate(activeDate);
	$("." + activeView).trigger('click');
});

$.when(one, two, three, userprofile_d).done(function () {
	
	getCalendarEventsData().then(function () {
		displayCalendar();
		$("#pageoverlay").addClass("hidden");
	});
});

function getCalendarEventsData() { //// Gets Events Data for Calendar from List/Indexed DB /////
	return new Promise(function (resolve, reject) {
		var lastmodifieddate = localStorage.getItem("CSPCalendarLastModifiedListDate_" + sitename);
		var oldmodifieddate = localStorage.getItem("CSPCalendar_LMDate_" + sitename);
		if (!lastmodifieddate || !oldmodifieddate || lastmodifieddate != oldmodifieddate) {
			pnpWeb.lists.getByTitle(calendarListName).items.select("*,ParticipantsPicker/ID,ParticipantsPicker/Title,Author/ID,Author/Title,Title,Description,EventDate,EndDate,Duration,RecurrenceData,AttachmentFiles,Is_x0020__x0020_Archive,CPTS,MAJCOM,Role,FY,AssignedComponent,CSPCategory/ID,CSPCategory/Title").expand("Author,ParticipantsPicker,AttachmentFiles,CSPCategory").filter("Is_x0020__x0020_Archive eq 0").top(5000).orderBy("Modified", false).get().then(function (data) {
				$.each(data, function (i, v) {
					var cspCategory = "";
					if (v.CSPCategory.length > 0) {
						$.each(v.CSPCategory, function (i, v) {
							cspCategory += v.Title + ", ";
						});
						cspCategory = cspCategory.slice(0, -2);
					}
					data[i].CSPCategory = cspCategory;
					allEventsMap.set(v.ID, v);
				});
				data.forEach( function(value) {
					value['Majcom'] = value['MAJCOM'];
					delete value['MAJCOM'];
				  });
				allEventsData = data;
				// Storing Events in IndexedDB when IndexedDB initialized //			
				IndexedDBPromise.then(function () {
					IndexedDB.storeDataInIndexedDb(allEventsData, calendarListName).then(function () {
						localStorage.setItem("CSPCalendar_LMDate_" + sitename, lastmodifieddate);
					});
				});
				///////////////	
				allEventsFilteredData = filterUserInnerViewData(allEventsData);
				resolve(allEventsFilteredData);
			}).catch(function (error) {
				reject(error);
			});
		} else {
			// Retrieving Events from IndexedDB when IndexedDB initialized //
			IndexedDBPromise.then(function () {
				IndexedDB.getIndexedDBData(calendarListName).then(function (data) {
					allEventsData = data;
					allEventsFilteredData = filterUserInnerViewData(allEventsData);
					$.each(allEventsData, function (i, v) {
						allEventsMap.set(v.ID, v);
					});
					resolve(allEventsFilteredData);
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

function displayCalendar() { //// Main function to display Calendar in required grid views /////
	$(calendarElement).html('');
	calendarMain = new FullCalendar.Calendar(calendarElement, {
		plugins: ['dayGrid', 'timeGrid'],
		defaultView: 'dayGridMonth',
		fixedWeekCount: false,
		header: { // buttons for switching between views
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
			console.log(info);
			var startDate = new Date(info.startStr);
			var endDate = new Date(info.endStr);
			parseEventsForCalendar(allEventsFilteredData, startDate, endDate);
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
			var evntLocation = info.event.extendedProps.fullEvent.Location ? ' ' + '(' + info.event.extendedProps.fullEvent.Location + ')' : '';
			$(info.el).closest('.fc-event').attr('eventId', info.event.extendedProps.fullEvent.ID);
			$(info.el).closest('.fc-event').attr('title', info.el.text + evntLocation);
			$(info.el).closest('.fc-event').css("border", "1px solid #dadada");
			$(info.el).closest('.fc-event').attr("CPTS", info.event.extendedProps.fullEvent.CPTS);
			$(info.el).closest('.fc-event').attr('href', "javascript:void(0);");
			setTitlesForButtons();
		},
		dayRender: function (info) {
			setTitlesForButtons();
		},
	});
	calendarMain.render();
}

function filterUserInnerViewData(data) { 
	var sqlQuery = ""; 
	if(serviceBaseCPTS!= null && serviceBaseCPTS != undefined){ 
	serviceBaseCPTS= serviceBaseCPTS.replace(/\//g, " ");}
	var component = (selectedComponent == "ALL" || selectedComponent == null || selectedComponent == undefined ? ComponentMultiQuery : "(AssignedComponent LIKE COALESCE('%" + selectedComponent + "%',AssignedComponent) OR AssignedComponent LIKE COALESCE('%ALL%',AssignedComponent))");
    var cpts = (serviceBaseCPTS == "ALL" || serviceBaseCPTS == null || serviceBaseCPTS == undefined ? CPTSMultiQuery : "(CPTS == COALESCE('" + serviceBaseCPTS + "',CPTS) OR CPTS LIKE COALESCE('%ALL%',CPTS))");
    var amcategory = (categoryVal == "ALL" || categoryVal == "None" || categoryVal == null || categoryVal == undefined || categoryVal == "" ? "" : "CSPCategory LIKE COALESCE('%" + categoryVal + "%', CSPCategory)");
    var majcomcpts = (MajcomVal == "ALL" || MajcomVal == null || MajcomVal == undefined || MajcomVal == "" ? MajcomMultiQuery : "(Majcom == COALESCE('" + MajcomVal + "',Majcom) OR (Majcom LIKE COALESCE('%ALL%',Majcom)))");   
    if (amcategory != "") {
		var sqlQuery    = ("SELECT * FROM ? where ("+ component +") AND ("+ cpts +") AND ("+ amcategory +") AND ("+ majcomcpts +")");
    } else {
		var sqlQuery   = ("SELECT * FROM ? where ("+ component +") AND ("+ cpts +") AND ("+ majcomcpts +")");
    }
	var SQLData = alasql(sqlQuery, [data]);
	return SQLData;
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

function showPopup(uniqueId) { //// To show event popup based on event instance clicked ////
	enablePopupSwitches(uniqueId);
	var calEvent = eventsData.filter(function (thisEvent) {
		return thisEvent.uniqueID == uniqueId;
	})[0];
	//makeElementDraggable("#EditCalendarEventPopup");
	$(".backgr").show();
	$("#EditCalendarEventPopup").show();
	$(".eventPopup .popup-body").scrollTop(0);
	$("#EditCalendarEventPopup").attr("uniqueId", uniqueId);
	$("#EditCalendarEventPopup").attr("eventId", calEvent.ID);
	$("#EditEventTitleview").html(filterNullOrUndefined(calEvent.Title) ? filterNullOrUndefined(calEvent.Title) : "");
	$("#EditEventLocationview").html(filterNullOrUndefined(calEvent.Location) ? filterNullOrUndefined(calEvent.Location) : "");
	$("#EditEventstartdateview").html((!calEvent.fAllDayEvent ? new Date(calEvent.EventDate).format('MM/dd/yyyy hh:mm tt') : formDateObjectWithouTZ(calEvent.EventDate).format('MM/dd/yyyy hh:mm tt')));
	$("#EditEventEnddateview").html((!calEvent.fAllDayEvent ? new Date(calEvent.EndDate).format('MM/dd/yyyy hh:mm tt') : formDateObjectWithouTZ(calEvent.EndDate).format('MM/dd/yyyy hh:mm tt')));
	$("#EditEventDescriptionview").html(filterNullOrUndefined(calEvent.Description) ? filterNullOrUndefined(calEvent.Description) : "");

	(calEvent.fAllDayEvent ? $("#EditAlldayEventview").html("Yes") : $("#EditAlldayEventview").html("No"));
	(allEventsMap.get(calEvent.ID).fRecurrence ? $("#EditRecurrenceEventview").html(decodeRecurringXML(allEventsMap.get(calEvent.ID))) : $("#EditRecurrenceEventview").html("No"));

	var cspCategory = calEvent.CSPCategory.split(", ");
	console.log(cspCategory);
	var categorytext = "";
	var categoryid = [];
	var allcategories = JSON.parse(localStorage.getItem('CSPCategory_' + sitename));
	$(allcategories).each(function (i, n) {
		$(cspCategory).each(function (j, v) {
			if (v == n.Categories) {
				categorytext += n.Categories + ", ";
				categoryid.push(n.ID);
			}
		});
		$("#EditCspCategoryview").html(categorytext.length > 0 ? categorytext.replace(/,\s*$/, "") : "");
	});
	$("#EditCategorySelecetdChoiceview").html(filterNullOrUndefined(calEvent.Category) ? filterNullOrUndefined(calEvent.Category) : "");

	if (calEvent.AttachmentFiles && calEvent.AttachmentFiles.length > 0) {
		var attachHtml = "<ul>"
		calEvent.AttachmentFiles.forEach(function (File) {
			attachHtml += "<li><a href='" + File.ServerRelativeUrl + "' target='_blank' title='" + File.FileName + "'> " + File.FileName + "</a></li>";
		})
		$("#EventAttachmentsView").html(attachHtml + "</ul>");
	} else {
		$("#EventAttachmentsView").html("<span>No</span");
	}
}

function enablePopupSwitches(uniqueId) { //// Enables Bottom Switch Buttons for Popup to switch b/w events in popup view ////
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

function registerCalendarEvents() { ////// Registers all calendar events //////
	$(".cancelEventBtn, .closeEventPopup").click(function () {
		$(".backgr").hide();
		$(this).closest(".eventPopup").hide();
	});

	$("#PreviousEvent").click(function () {
		showPopup($(this).attr('PrevEventId'));
	});

	$("#NextEvent").click(function () {
		showPopup($(this).attr('NextEventId'));
	});

	$("#ddlServicingCPTS").change(function () {
		serviceBaseCPTS = $("#ddlServicingCPTS").val();
		allEventsFilteredData = filterUserInnerViewData(allEventsData);
		var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
		var activeDate = calendarMain.getDate();
		displayCalendar();
		calendarMain.gotoDate(activeDate);
		$("." + activeView).trigger('click');
	});

	$("#ddlCategory").change(function () {
		categoryVal = $("#ddlCategory").val();
		allEventsFilteredData = filterUserInnerViewData(allEventsData);
		var activeView = ($("#divcalendarcomponent .fc-button-active").text() == "week" ? 'fc-timeGridWeek-button' : ($("#divcalendarcomponent .fc-button-active").text() == "day" ? 'fc-timeGridDay-button' : 'fc-dayGridMonth-button'));
		var activeDate = calendarMain.getDate();
		displayCalendar();
		calendarMain.gotoDate(activeDate);
		$("." + activeView).trigger('click');
	});
}

$(document).on("click ", ".feedbacklink", function () { ////// Event for feedback popup toggle issue //////
	$(".feedbackpopup").removeClass("hidden");
	$(".popup").hide();
	$(".feedbackpopup").show();
	$(".feedbackpopup").toggleClass("hidden");
});

//// Calendar Common Functions Starts Here ////

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

function filterNullOrUndefined(value) {
	if (value && value.trim()) {
		return value;
	} else {
		return "";
	}
}

function makeElementDraggable(elementId) {
	$(elementId).draggable();
	$(elementId).css('top', 'initial');
	$(elementId).css('left', 'inherit');
}

function setTitlesForButtons() {
	$("#divcalendarcomponent .fc-prev-button").attr("title", "Previous");
	$("#divcalendarcomponent .fc-next-button").attr("title", "Next");
	$("#divcalendarcomponent .fc-timeGridDay-button").attr("title", "Day");
	$("#divcalendarcomponent .fc-timeGridWeek-button").attr("title", "Week");
	$("#divcalendarcomponent .fc-dayGridMonth-button").attr("title", "Month");
}

function formDateObjectWithouTZ(userDate) {
	if (!(userDate instanceof Date)) {
		userDate = userDate.replace(/[TZ]/g, " ");
		return new Date(userDate);
	} else {
		return userDate;
	}
}

function convertXml2JSon(Recurrence) {
	var x2js = new X2JS();
	var data = Recurrence;
	return JSON.stringify(x2js.xml_str2json(data));
}

//// Generic Functions Ends Here ////