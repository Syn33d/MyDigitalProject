import { PartialType } from "@nestjs/mapped-types";
import { CreateCollaborationMagazineDto } from "./create-collaborationMagazine.dto";

export class UpdateCollaborationMagazineDto extends PartialType(CreateCollaborationMagazineDto){}