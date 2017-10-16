(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('DownloadService', DownloadService);

  DownloadService.$inject = ['$http', 'FileSaver', 'NotifycationService', 'DebugConsoleService'];

  function DownloadService($http, FileSaver, NotifycationService, mtDebug) {

    return {
      downloadFile: downloadFile,
      downloadTorrent: downloadTorrent,
      downloadSubtitle: downloadSubtitle,
      downloadForumAttach: downloadForumAttach
    };

    /**
     * downloadTorrent
     * @param id
     */
    function downloadTorrent(id) {
      var url = '/api/torrents/download/' + id;
      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('TORRENTS_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        NotifycationService.showErrorNotify(err.data.message, 'TORRENT_DOWNLOAD_ERROR');
      });
    }

    /**
     * downloadSubtitle
     * @param tid
     * @param sid
     */
    function downloadSubtitle(tid, sid) {
      var url = '/api/subtitles/' + tid + '/' + sid;
      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('SUBTITLE_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        NotifycationService.showErrorNotify(err.data.message, 'SUBTITLE_DOWNLOAD_ERROR');
      });
    }

    /**
     * downloadForumAttach
     * @param tid
     * @param rid
     * @param aid
     */
    function downloadForumAttach(tid, rid, aid) {
      var url = '/api/attach/' + tid;
      url += rid ? '/' + rid : '';
      url += '?attachId=' + aid;

      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('FORUMS.ATTACHE_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        NotifycationService.showErrorNotify(err.data.message, 'FORUMS.ATTACHE_DOWNLOAD_FAILED');
      });
    }

    /**
     * downloadFile
     * @param url
     * @param request
     * @param successcb
     * @param errorcb
     */
    function downloadFile(url, request, successcb, errorcb) {
      $http({
        url: url,
        method: 'GET',
        params: request,
        responseType: 'blob'
      }).then(function successCallback(response) {
        var contentDisposition = response.headers('Content-Disposition');
        var fileName = decodeURI(contentDisposition.substr(contentDisposition.indexOf('filename=') + 9));
        FileSaver.saveAs(response.data, fileName);

        if (successcb) successcb(response.status);
      }, function errorCallback(response) {
        if (errorcb) errorcb(response);
      });
    }
  }
}());
