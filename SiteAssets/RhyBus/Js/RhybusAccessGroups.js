const ACCESS_GROUPS_LIST_NAME = 'RhybusAccessGroups'
var accessGroupsSiteUrl = _spPageContextInfo.webAbsoluteUrl;

$(document).ready(function () {
    accessGroupsSiteUrl = _spPageContextInfo.webAbsoluteUrl;
    $("#btnCreateUserGroups").click(function () {
        // get Data from Sharepoint list
        getListData();
    });
});

function getListData() {
    var d3 = $.Deferred();
    var AGUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + ACCESS_GROUPS_LIST_NAME + "')/items?";
    getAccessGroupsData(AGUrl, d3, true).done(function (data) {
        var result = data.d.results;
        var count = 0;
        if (result.length > 0) {
            $.each(result, function (i, v) {
                console.log(v);
                onQuerySucceeded(v);
                count++;
                console.log(count);
                if (result.length == count) {
                    alert("Successfully created all the " + count + " groups. After click on ok wait for some time to set permissions and group owner to the created group.");
                }
            });
        } else {
            alert("There are no access groups to add. To add access groups, navigate to site contents and add rows to the RhybusAccessGroups list.");
        }
    });
}

function onQuerySucceeded(value) {
    var groupName = toReturnValue(value.GroupName);
    var groupDescription = toReturnValue(value.Description);
    var userId = toCheckNotNullValues(value.GroupOwnersId);
    var permissionLevels = toReturnValue(value.PermissionLevels);
    var viewMembership = toCheckNotNullValues(value.ViewMembership);
    var editMembership = toCheckNotNullValues(value.EditMembership);
    createGroup(groupName, groupDescription, userId, permissionLevels, viewMembership, editMembership);
}

function toReturnValue(inputValue) {
    return inputValue == "Select" || inputValue == "select" || inputValue == undefined || inputValue == null || inputValue == "" ? "" : inputValue.trim('');
}

//button functions
//create group
function createGroup(groupName, groupDescription, userId, permissionLevels, viewMembership, editMembership) {
    var item = {
        "__metadata": {
            "type": "SP.Group"
        },
        "Title": groupName,
        "Description": groupDescription,
    };
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups";
    addAccessGroupsData(url, item, false).done(function (data) {
        var groupId = data.d.Id;
        setNewPermissionsForGroup(groupName, groupId, permissionLevels, viewMembership, editMembership, userId);
    }).catch(function (e) {
        if (e.error.code == "-2130575293, Microsoft.SharePoint.SPException") {
            var group_d = $.Deferred();
            var group_url = accessGroupsSiteUrl + "/_api/web/sitegroups/getbyname('" + groupName + "')";
            getAccessGroupsData(group_url, group_d, true).done(function(data) {
                var existingGroupId = data.d.Id;
                setNewPermissionsForGroup(groupName, existingGroupId, permissionLevels, viewMembership, editMembership, userId);
            });
        }
    });
}

//set permissions
// Add the new role assignment for the group on the list.
function setNewPermissionsForGroup(groupName, groupId, permissionLevels, viewMembership, editMembership, userId) {
    var targetRoleDefinitionId = "";
    if (permissionLevels == "Contribute") {
        targetRoleDefinitionId = "1073741827";
    }
    if (permissionLevels == "Full Control") {
        targetRoleDefinitionId = "1073741829";
    }
    if (permissionLevels == "Design") {
        targetRoleDefinitionId = "1073741828";
    }
    if (permissionLevels == "Edit") {
        targetRoleDefinitionId = "1073741830";
    }
    if (permissionLevels == "Read") {
        targetRoleDefinitionId = "1073741826";
    }
    if (permissionLevels == "View Only") {
        targetRoleDefinitionId = "1073741924";
    }
    $.ajax({
        url: accessGroupsSiteUrl + '/_api/web/roleassignments/addroleassignment(principalid=' + groupId + ', roledefid=' + targetRoleDefinitionId + ')',
        type: 'POST',
        async: false,
        headers: {
            'X-RequestDigest': $('#__REQUESTDIGEST').val()
        },
        success: function () {
            setGroupOwner(groupName, groupId, userId, viewMembership, editMembership);

        },
        error: errorHandler
    });
}

function setGroupOwner(groupName, groupId, userId, viewMembership, editMembership, newGroupName) {
    var clientContext = new SP.ClientContext();
    var ownerGroup

    //Set Group as an owner  
    if (typeof userId === "string") {
        ownerGroup = clientContext.get_web().get_siteGroups().getByName(userId);
    } else {
        ownerGroup = clientContext.get_web().get_siteGroups().getById(userId);
    }

    //This is the group of which "owner" needs to set
    var groupToUpdate = clientContext.get_web().get_siteGroups().getById(groupId);

    // Set the owner property of the group
    groupToUpdate.set_owner(ownerGroup);

    // Update Group
    groupToUpdate.update();

    // Execute the query to the server.
    clientContext.executeQueryAsync(onSuccess(groupName, viewMembership, editMembership, newGroupName), onFailed);
}

function onSuccess(groupName, viewMembership, editMembership, newGroupName) {
    condition(groupName, viewMembership, editMembership, newGroupName);
}

function onFailed(sender, args) {
    console.log('Failed' + args.get_message() + '\n' + args.get_stackTrace());
}

function errorHandler(xhr, ajaxOptions, thrownError) {
    console.log('Request failed: ' + xhr.status + '\n' + thrownError + '\n' + xhr.responseText);
}

//set permissions
//group settings on view
function condition(groupName, viewMembership, editMembership, newGroupName) {
    var newGroupUrl = "/_api/web/sitegroups/getbyname('" + groupName + "')";

    var metadata = {
        __metadata: {
            'type': 'SP.Group'
        },
        OnlyAllowMembersViewMembership: viewMembership,
        AllowMembersEditMembership: editMembership,
    };

    if (newGroupName) {
        metadata = {
            __metadata: {
                'type': 'SP.Group'
            },
            Title: newGroupName,
            Description: newGroupName,
            OnlyAllowMembersViewMembership: viewMembership,
            AllowMembersEditMembership: editMembership,
        };
    }
    updateGroup(newGroupUrl, metadata);
}

function updateGroup(newGroupUrl, metadata) {
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + newGroupUrl,
        type: "MERGE",
        async: false,
        data: JSON.stringify(metadata),
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "content-Type": "application/json;odata=verbose",
        },
        success: function () {
            console.log("Group membership property has been updated.");
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}

function getAccessGroupsData(url, d, async) {
    $.ajax({
        url: url,
        method: "GET",
        async: async,
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            d.resolve(data);
        },
        error: function () {
            d.reject;
        }
    });
    return d.promise();
}

function addAccessGroupsData(url, items, async) {
    var d = $.Deferred();
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(items),
        async: async,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "POST"
        },
        success: function (data) {
            d.resolve(data);
        },
        error: function (xhr) { //OnError
            d.reject(jQuery.parseJSON(xhr.responseText));
        }
    });
    return d.promise();
}