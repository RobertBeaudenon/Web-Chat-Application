import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content'); //selecting block of html using class name
    this.postId = this.route.snapshot.paramMap.get('id');

    this.init();
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none'; //hiding yhr '.nav-content' block
  }

  AddComment() {
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      console.log(data);
    });
  }
}
