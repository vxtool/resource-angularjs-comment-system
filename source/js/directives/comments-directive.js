(function() {
  'use strict';

  angular
  .module('comments')
  .directive('comments', comments);

  comments.$inject = ['$rootScope', '$sce', 'md5'];

  function comments($rootScope, $sce, md5) {
    return {
      restrict: 'E',
      transclude: true,
      scope:{},
      templateUrl: './source/js/templates/comments.html',
      link: function(scope, element, attrs) {
        var markdown;
        var authorEmail;

        authorEmail = 'hemerson.lourenco@gmail.com';
        scope.comments = [
          {
            id: 1,
            author: {
              name: 'Person 1',
              email: 'person1@gmail.com',
              website: 'person1.io'
            },
            content: 'I am person 1',
            loved: false
          },
          {
            id: 2,
            author: {
              name: 'Person 2',
              email: 'person2@gmail.com',
              website: 'person2.io'
            },
            content: 'I am person 2',
            loved: true
          },
          {
            id: 3,
            author: {
              name: 'Person 3',
              email: 'person3@gmail.com',
              website: 'person3.io'
            },
            content: 'I am person 3',
            loved: false
          }
        ];
        scope.newComment = {};
        markdown = function (string) {
          string = string.replace(/(@.+)@/g, '<span class="reply">$1</span>');
          string = string.replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>');
          string = string.replace(/__(.+)__/g, '<strong>$1</strong>');
          string = string.replace(/\*(.+)\*/g, '<em>$1</em>');
          string = string.replace(/_(.+)_/g, '<em>$1</em>');
          string = string.replace(/``(.+)``/g, '<code>$1</code>');
          string = string.replace(/`(.+)`/g, '<code>$1</code>');
          return string;
        };
        scope.parseContent = function (content) {
          return $sce.trustAsHtml(content);
        };
        scope.isAuthor = function (email) {
          return email === authorEmail;
        };
        scope.getGravatar = function (email) {
            var hash;
            if (email === void 0) {
                email = '';
            }
            hash = email.trim();
            hash = hash.toLowerCase();
            hash = md5.createHash(hash);
            return 'http://gravatar.com/avatar/' + hash + '?s=104&d=identicon';
            //return 'http://placehold.it/100x100';
        };
        scope.loveComment = function (commentId) {
            var comment, i, len, ref, results;
            ref = scope.comments;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                if (window.CP.shouldStopExecution(1)) {
                    break;
                }
                comment = ref[i];
                if (comment.id === commentId) {
                    results.push(comment.loved = !comment.loved);
                } else {
                    results.push(void 0);
                }
            }
            window.CP.exitedLoop(1);
            return results;
        };
        scope.addReply = function (author) {
            if (scope.newComment.content === void 0) {
                scope.newComment.content = '';
            }
            if (scope.newComment.content.search('@' + author + '@') === -1) {
                if (scope.newComment.content[0] === '@') {
                    scope.newComment.content = ', ' + scope.newComment.content;
                } else {
                    scope.newComment.content = ' ' + scope.newComment.content;
                }
                return scope.newComment.content = '@' + author + '@' + scope.newComment.content;
            }
        };
        scope.addNewComment = function () {
            scope.newComment.id = scope.comments.length + 1;
            scope.newComment.author.website = scope.newComment.author.website.replace(/https?:\/\/(www.)?/g, '');
            scope.newComment.content = markdown(scope.newComment.content);
            scope.newComment.loved = false;
            scope.comments.push(scope.newComment);
            return scope.newComment = {};
        };
        return scope.$watch('newComment.email', function (newValue, oldValue) {
          var newCommentAvatar;
          newCommentAvatar = document.getElementById('newCommentAvatar');
          return newCommentAvatar.src = scope.getGravatar(scope.newComment.email);
        });
      }
    }
  }
})();
