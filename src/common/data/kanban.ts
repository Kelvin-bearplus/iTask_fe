import avatar5 from "assets/images/users/avatar-5.jpg"
import avatar3 from "assets/images/users/avatar-3.jpg"
import avatar10 from "assets/images/users/avatar-10.jpg"
import avatar8 from "assets/images/users/avatar-8.jpg"
import avatar2 from "assets/images/users/avatar-2.jpg"
import avatar1 from "assets/images/users/avatar-1.jpg"
import avatar4 from "assets/images/users/avatar-4.jpg"
import avatar6 from "assets/images/users/avatar-6.jpg"
import avatar7 from "assets/images/users/avatar-7.jpg"
import avatar9 from "assets/images/users/avatar-9.jpg"
import imge7 from "assets/images/small/img-7.jpg"
import imge4 from "assets/images/small/img-4.jpg"
const headData = [
  {
    id: 1,
    name: "Nancy",
    picture: avatar5,
  },
  {
    id: 2,
    name: "Frank",
    picture: avatar3,
  },
  {
    id: 3,
    name: "Tonya",
    picture: avatar10,
  },
  {
    id: 4,
    name: "Thomas",
    picture: avatar8,
  },
  {
    id: 5,
    name: "Herbert",
    picture: avatar2,
  },
];
const tasklist =[
  {
    "status": "0",
    "name": "Unassigned",
    "tasks": [
      {
        "id": 20,
        "created_at": "2024-04-21T11:38:25+07:00",
        "updated_at": "2024-04-21T11:38:25+07:00",
        "name": "hello",
        "description": "<p>sửa bài tập về nhà</p>",
        "status": 2,
        "parent_task_id": 0,
        "position": 1,
        "priority": 3,
        "due_date": "2024-04-22T07:00:00+07:00",
        "started_at": "2024-04-23T07:00:00+07:00",
        "completed_at": null,
        "project_info": {
          "id": 1,
          "name": "Project iTask",
          "description": "This is a Task Management System web",
          "thumbnail_url": null
        },
        "owner": {
          "id": 6,
          "full_name": "Trần Phúc Khánh",
          "profile_ava_url": "",
          "title": "Backend Developer"
        },
        "assignees": [
          {
            "user_info": {
              "id": 4,
              "full_name": "William Horror",
              "profile_ava_url": "",
              "title": "Team Lead"
            }
          }
        ]
      }
    ]
  },
  {
    "status": "1",
    "name": "Pending",
    "tasks": [
      {
        "id": 21,
        "created_at": "2024-04-21T11:38:25+07:00",
        "updated_at": "2024-04-21T11:38:25+07:00",
        "name": "sửa homepage",
        "description": "<p>sửa bài tập về nhà</p>",
        "status": 2,
        "parent_task_id": 0,
        "position": 1,
        "priority": 3,
        "due_date": "2024-04-22T07:00:00+07:00",
        "started_at": "2024-04-23T07:00:00+07:00",
        "completed_at": null,
        "project_info": {
          "id": 1,
          "name": "Project iTask",
          "description": "This is a Task Management System web",
          "thumbnail_url": null
        },
        "owner": {
          "id": 6,
          "full_name": "Trần Phúc Khánh",
          "profile_ava_url": "",
          "title": "Backend Developer"
        },
        "assignees": [
          {
            "user_info": {
              "id": 4,
              "full_name": "William Horror",
              "profile_ava_url": "",
              "title": "Team Lead"
            }
          }
        ]
      },
      {
        "id": 31,
        "created_at": "2024-04-21T11:38:25+07:00",
        "updated_at": "2024-04-21T11:38:25+07:00",
        "name": "test",
        "description": "<p>sửa bài tập về nhà</p>",
        "status": 2,
        "parent_task_id": 0,
        "position": 1,
        "priority": 3,
        "due_date": "2024-04-22T07:00:00+07:00",
        "started_at": "2024-04-23T07:00:00+07:00",
        "completed_at": null,
        "project_info": {
          "id": 1,
          "name": "Project iTask",
          "description": "This is a Task Management System web",
          "thumbnail_url": null
        },
        "owner": {
          "id": 6,
          "full_name": "Trần Phúc Khánh",
          "profile_ava_url": "",
          "title": "Backend Developer"
        },
        "assignees": [
          {
            "user_info": {
              "id": 4,
              "full_name": "William Horror",
              "profile_ava_url": "",
              "title": "Team Lead"
            }
          }
        ]
      }
    ]
  },
  {
    "status": "2",
    "name": "In Progress",
    "tasks": [ {
      "id": 22,
      "created_at": "2024-04-21T11:38:25+07:00",
      "updated_at": "2024-04-21T11:38:25+07:00",
      "name": "sửa bài tập cho sinh viên",
      "description": "<p>sửa bài tập về nhà</p>",
      "status": 2,
      "parent_task_id": 0,
      "position": 1,
      "priority": 3,
      "due_date": "2024-04-22T07:00:00+07:00",
      "started_at": "2024-04-23T07:00:00+07:00",
      "completed_at": null,
      "project_info": {
        "id": 1,
        "name": "Project iTask",
        "description": "This is a Task Management System web",
        "thumbnail_url": null
      },
      "owner": {
        "id": 6,
        "full_name": "Trần Phúc Khánh",
        "profile_ava_url": "",
        "title": "Backend Developer"
      },
      "assignees": [
        {
          "user_info": {
            "id": 4,
            "full_name": "William Horror",
            "profile_ava_url": "",
            "title": "Team Lead"
          }
        }
      ]
    }]
  },
  {
    "status": "3",
    "name": "Completed",
    "tasks": []
  }
]
  
const AddTeamMember = [
  { id: 1, img: avatar1, name: 'Albert Rodarte' },
  { id: 2, img: avatar2, name: 'Hannah Glover' },
  { id: 3, img: avatar3, name: 'Adrian Rodarte' },
  { id: 4, img: avatar4, name: 'Frank Hamilton' },
  { id: 5, img: avatar5, name: 'Justin Howard' },
  { id: 6, img: avatar6, name: 'Michael Lawrence' },
  { id: 7, img: avatar7, name: 'Oliver Sharp' },
  { id: 8, img: avatar8, name: 'Richard Simpson' }
]
export { headData, tasklist, AddTeamMember }