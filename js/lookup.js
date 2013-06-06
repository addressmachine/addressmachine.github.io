document.getElementById('lookupform').onsubmit = function() {
    var q = document.getElementById('lookup').value;
    var service;
    if (q.match(/^@/)) {
        service = 'twitter';
    } else {
        service = 'email';
    }
    var hash = hex_sha1(q);
    var r = new XMLHttpRequest();
    r.open('GET', '/addresses/'+service+'/bitcoin/user/'+hash+'/', true);

    r.onreadystatechange = function () {

        if (r.readyState != 4) {
            return;
        }
        if (r.status == 404) {
            alert('not found');
            return false;
        } else if (r.status != 200) {
            alert('wonky status:'+r.status);
            return false;
        }

        document.getElementById('lookup_results').innerHTML += '';

        console.log(r.responseText);
        var data = JSON.parse(r.responseText);
        for (var i=0; i<data.length; i++) {
            var item = data[i];
            if (typeof item == 'string') {
                display_address(hash, q, item);
            }
        }

        return false;
    };

    r.send();
    return false;

}

function display_address(id, term, addr) {
    if (id == '') {
        return false;
    }
    if (addr == '') {
        return false;
    }
    console.log("need to validate address "+addr+" for id "+id);

    var r = new XMLHttpRequest();
    r.open('GET', "/addresses/twitter/bitcoin/user/"+id+"/"+addr, true);
    r.onreadystatechange = function () {

        if (r.readyState != 4) {
            return;
        }
        if (r.status == 404) {
            alert('not found');
            return false;
        } else if (r.status != 200) {
            alert('wonky status:'+r.status);
            return false;
        }
        console.log(r.responseText);
        var data = JSON.parse(r.responseText);
        for (var i=0; i<data.length; i++) {
            var item = data[i];
            if (typeof item == 'string') {
                validate_address(hash, item);
            }
        }

        console.log(data);
        var address = data.payload.address;
        // TODO: Ideally we'd verify this data...
        //var gpg_signed_data = data.gpg_signed_data;
        if (address) {
            document.getElementById('lookup_result_term').innerHTML = '';
            document.getElementById('lookup_result_term').appendChild(document.createTextNode(term));
            document.getElementById('lookup_result_address').innerHTML = '';
            document.getElementById('lookup_result_address').appendChild(document.createTextNode(address));
            document.getElementById('lookup_results').style.display='block';
            document.getElementById('lookup_result_signed_data_textarea').innerHTML = '';
            document.getElementById('lookup_result_signed_data_textarea').appendChild(document.createTextNode(data.gpg_signed_data));
            document.getElementById('lookup_result_gpg_link').onclick = function() {
                if (document.getElementById('lookup_result_signed_data').style.display == 'block') {
                    document.getElementById('lookup_result_signed_data').style.display='none';
                } else {
                    document.getElementById('lookup_result_signed_data').style.display='block';
                }
            }
            //document.getElementById('lookup_result_signed_data').style.display = 'block';
            //document.getElementById('lookup_results').innerHTML += '<div id="address-'+address+'" class="unverified">'+address+ '</div> ';
            //document.getElementById('lookup_results').innerHTML += '<textarea>'+gpg_signed_data+'</textarea>';
        }

        return false;

    }

    r.send();

}
